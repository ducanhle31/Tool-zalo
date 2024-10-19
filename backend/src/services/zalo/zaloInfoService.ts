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
  let allUsers: any[] = [];
  let offset = 0;
  const count = 50;

  try {
    let totalUsers = 0;
    let response;

    do {
      const dataParam = {
        offset,
        count,
      };

      response = await axios.get(url, {
        params: {
          data: JSON.stringify(dataParam),
        },
        headers: {
          access_token: tokenData.access_token,
        },
      });

      const { data } = response.data;
      totalUsers = data.total;
      allUsers = [...allUsers, ...data.users];

      offset += count;
    } while (offset < totalUsers);

    return {
      data: {
        total: totalUsers,
        count: allUsers.length,
        offset: 0,
        users: allUsers,
      },
      error: 0,
      message: "Success",
    };
  } catch (error) {
    console.error("Error fetching OA Info:", error);
    throw new Error("Failed to get Zalo Official Account information");
  }
};

export const getUserDetail = async (userId: string) => {
  const tokenData = readTokenFromFile();
  const url = `https://openapi.zalo.me/v3.0/oa/user/detail`;
  const dataParam = {
    user_id: userId, 
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
    console.error("Error fetching user detail:", error);
    throw new Error("Failed to get Zalo user details");
  }
};
