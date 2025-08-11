import { ref, computed } from "vue";
import { keycloak, ensureFreshToken } from "@/keycloak.js";

const username = ref(undefined);
const userId = ref(undefined);

function hydrateProfile() {
  const p = keycloak.tokenParsed || {};
  username.value = p.preferred_username;
  userId.value = p.sub; // stable user id to send to backend
}
if (keycloak.authenticated) hydrateProfile();
keycloak.onAuthSuccess = hydrateProfile;

export function useAuth() {
  const isAuthenticated = computed(() => keycloak.authenticated === true);

  async function login() {
    // await keycloak.login();
    await keycloak.login({
      redirectUri: window.location.origin + window.location.pathname,
      prompt: "login",
      // responseMode is taken from init; no need to set again
    });
  }
  async function logout() {
    await keycloak.logout({ redirectUri: window.location.origin });
  }
  async function getAccessToken() {
    if (!keycloak.authenticated) return undefined;
    await ensureFreshToken(30);
    return keycloak.token;
  }

  return { isAuthenticated, login, logout, getAccessToken, username, userId };
}
