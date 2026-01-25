import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";

import "./index.css";
import "./index_overrides.css";

import App from "./App.vue";
import router from "./router";
import { LANGUAGES } from "@/locales/languages.js";
import { keycloak, ensureFreshToken } from "@/keycloak.js";

export const ENABLE_KEYCLOAK = false;
const SUPPORTED_LANGUAGE_CODE_LIST = LANGUAGES.map((i) => i.code);
const FALLBACK_LANGUAGE_CODE = "en";

async function loadLocaleMessage(locale) {
  try {
    const messages = await import(`./locales/${locale}.json`);
    return messages.default;
  } catch (e) {
    console.warn(`Could not load locale ${locale}, falling back to ${FALLBACK_LANGUAGE_CODE}`);
    return null;
  }
}

async function initApp() {
  let userLocale = localStorage.getItem("languageCode");
  if (!userLocale) {
    userLocale = FALLBACK_LANGUAGE_CODE;
    localStorage.setItem("languageCode", userLocale);
  }
  // const userLocale = navigator.language.split('-')[0] || fallbackLocale
  const isSupported = SUPPORTED_LANGUAGE_CODE_LIST.includes(userLocale);
  if (!isSupported) {
    userLocale = FALLBACK_LANGUAGE_CODE;
    localStorage.setItem("languageCode", userLocale);
  }

  const [fallbackMessages, activeMessages] = await Promise.all([
    loadLocaleMessage(FALLBACK_LANGUAGE_CODE),
    isSupported ? loadLocaleMessage(userLocale) : Promise.resolve(null),
  ]);

  const i18n = createI18n({
    legacy: false,
    locale: userLocale,
    FALLBACK_LANGUAGE_CODE,
    messages: {
      [FALLBACK_LANGUAGE_CODE]: fallbackMessages,
      ...(isSupported && activeMessages ? { [userLocale]: activeMessages } : {}),
    },
  });

  if (ENABLE_KEYCLOAK) {
    const authenticated = await keycloak.init({
      onLoad: "check-sso", // or "login-required"
      // onLoad: undefined,
      pkceMethod: "S256",
      flow: "standard",
      responseMode: "query", // <—— IMPORTANT: avoid fragment/hash
      checkLoginIframe: true,
      silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
      // Keycloak-js uses current URL by default. If you still see oddities, uncomment:
      // redirectUri: cleanRedirectUri(),
    });
    if (authenticated) {
      console.log("authenticated");
    } else {
      console.log("unauthenticated");
    }
    // Keep token fresh in the background.
    setInterval(() => ensureFreshToken(30), 20000);
  }

  const app = createApp(App);

  app.use(i18n);
  app.use(createPinia());
  app.use(router);

  app.mount("#app");
}

initApp();
