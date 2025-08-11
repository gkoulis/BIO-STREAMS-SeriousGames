import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
  url: "https://auth.dev.bio-streams.eu/",
  realm: "biostreams",
  clientId: "marketplace-serious-games",
});

// Ensure the token won’t expire in the next N seconds
export async function ensureFreshToken(minSeconds = 30) {
  if (!keycloak.authenticated) return; // no token to refresh
  try {
    await keycloak.updateToken(minSeconds);
  } catch (e) {
    // session likely gone
    await keycloak.login();
  }
}
