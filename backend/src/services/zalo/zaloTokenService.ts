import axios from "axios";
import fs from "fs";
import { DateTime } from "luxon";
import path from "path";
import { readCodeVerifierFromFile } from "../../untils/pkceUtils";

const appId = process.env.APP_ID!;
const secretKey = process.env.SECRET_KEY!;

const tokenFilePath = path.join(__dirname, "./token.json");

export const exchangeCodeForAccessToken = async (code: string) => {
  const codeVerifier = readCodeVerifierFromFile();
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
    console.log(tokenData);
    fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2), "utf8");

    return tokenData;
  } catch (error) {
    throw new Error("Failed to exchange authorization code for access token");
  }
};

// Hàm ghi token mới vào file JSON
const writeTokenToFile = (tokenData: any) => {
  fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2), "utf8");
};

// Hàm làm mới Access Token bằng Refresh Token

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
