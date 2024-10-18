import axios from "axios";
import { readTokenFromFile } from "./zaloJobTokenService";

export const getOfficialAccountInfo = async () => {
  const tokenData = readTokenFromFile();
  try {
    const response = await axios.get("https://openapi.zalo.me/v2.0/oa/getoa", {
      headers: {
        access_token: tokenData.access_token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching OA Info:", error);
    throw new Error("Failed to get Zalo Official Account information");
  }
};
