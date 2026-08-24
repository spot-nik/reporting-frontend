import { getMe } from "./Queries/monday.js";
import { generatePkcePair } from "./pkce.js";

export async function redirectToAuthorization() {
  const { id: userId, account: { slug } } = await getMe();
  const { codeVerifier, codeChallenge } = await generatePkcePair();
  const state = JSON.stringify({
    user_id: userId,
    app_id: import.meta.env.VITE_MONDAY_APP_ID,
    code_verifier: codeVerifier,
  });
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_CLIENT_ID,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  window.location.replace(
    `https://${slug}.monday.com/oauth2/authorize?${params.toString()}`
  );
}
