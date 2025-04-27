import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";

import "./index.css";

import "./index_overrides.css";

import App from "./App.vue";
import router from "./router";
import { LANGUAGES } from "@/locales/languages.js";

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
  const userLocale = localStorage.getItem("languageCode") || FALLBACK_LANGUAGE_CODE;
  localStorage.setItem("languageCode", userLocale); // Ensure.
  // const userLocale = navigator.language.split('-')[0] || fallbackLocale
  const isSupported = SUPPORTED_LANGUAGE_CODE_LIST.includes(userLocale);
  const activeLocale = isSupported ? userLocale : FALLBACK_LANGUAGE_CODE;

  const [fallbackMessages, activeMessages] = await Promise.all([
    loadLocaleMessage(FALLBACK_LANGUAGE_CODE),
    isSupported ? loadLocaleMessage(activeLocale) : Promise.resolve(null),
  ]);

  const i18n = createI18n({
    legacy: false,
    locale: activeLocale,
    FALLBACK_LANGUAGE_CODE,
    messages: {
      [FALLBACK_LANGUAGE_CODE]: fallbackMessages,
      ...(isSupported && activeMessages ? { [activeLocale]: activeMessages } : {}),
    },
  });

  const app = createApp(App);

  app.use(i18n);
  app.use(createPinia());
  app.use(router);

  app.mount("#app");
}

initApp();
