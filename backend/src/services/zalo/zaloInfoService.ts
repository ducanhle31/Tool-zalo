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

export const getUserOa = async () => {
  const tokenData = readTokenFromFile();
  const url = `https://openapi.zalo.me/v3.0/oa/user/getlist`;
  const dataParam = {
    offset: 0,
    count: 48,
  };

  try {
    const response = await axios.get(url, {
      params: {
        data: JSON.stringify(dataParam),
      },
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
