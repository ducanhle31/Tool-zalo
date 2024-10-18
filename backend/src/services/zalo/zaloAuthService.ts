import crypto from "crypto";
import {
  generateCodeChallenge,
  generateCodeVerifier,
} from "../../untils/pkceUtils";

const appId = process.env.APP_ID!;
const redirectUri =
  process.env.ZALO_REDIRECT_URI!;

export const getAuthorizationUrl = () => {
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  return `https://oauth.zaloapp.com/v4/oa/permission?app_id=${appId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&code_challenge=${encodeURIComponent(codeChallenge)}&state=${state}`;
};
