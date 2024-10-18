import axios from "axios";
import crypto from "crypto";
import fs from "fs";
import { DateTime } from "luxon";
import path from "path";

const appId = process.env.APP_ID || "4383217975172036996";
const secretKey = process.env.SECRET_KEY || "eSQTIpVIeDd2Zs8R6AFe";
const redirectUri =
  process.env.ZALO_REDIRECT_URI ||
  "http://localhost:3000/api/v1/authzalo/callback";

const tokenFilePath = path.join(__dirname, "./token.json");

let codeVerifier = "";

export const generateCodeVerifier = () => {
  codeVerifier = crypto.randomBytes(32).toString("base64url").slice(0, 43);
  console.log(codeVerifier);
  return codeVerifier;
};

export const generateCodeChallenge = (codeVerifier: string) => {
  return crypto.createHash("sha256").update(codeVerifier).digest("base64url");
};

export const getAuthorizationUrl = () => {
  const state = crypto.randomBytes(16).toString("hex");
  const codeChallenge = generateCodeChallenge(generateCodeVerifier());
  return `https://oauth.zaloapp.com/v4/oa/permission?app_id=${appId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&code_challenge=${encodeURIComponent(codeChallenge)}&state=${state}`;
};

export const exchangeCodeForAccessToken = async (code: string) => {
  try {
    const response = await axios.post(
      "https://oauth.zaloapp.com/v4/oa/access_token",
      null,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          secret_key: secretKey,
        },
        params: {
          code,
          app_id: appId,
          grant_type: "authorization_code",
          code_verifier: codeVerifier,
        },
      }
    );

    const createdAt = DateTime.now().setZone("Asia/Ho_Chi_Minh").toISO();

    const tokenData = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      created_at: createdAt,
    };

    fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2), "utf8");

    return tokenData;
  } catch (error) {
    throw new Error("Failed to exchange authorization code for access token");
  }
};

const writeTokenToFile = (tokenData: any) => {
  fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2), "utf8");
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(
      "https://oauth.zaloapp.com/v4/oa/access_token",
      null,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          secret_key: secretKey,
        },
        params: {
          refresh_token: refreshToken,
          app_id: appId,
          grant_type: "refresh_token",
        },
      }
    );
    const createdAt = DateTime.now().setZone("Asia/Ho_Chi_Minh").toISO();
    const newTokenData = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      created_at: createdAt,
    };

    writeTokenToFile(newTokenData);
    return newTokenData;
  } catch (error) {
    console.error("Error refreshing Access Token:", error);
    throw new Error("Cannot refresh Access Token");
  }
};
