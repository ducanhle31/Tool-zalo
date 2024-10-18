import fs from "fs";
import { DateTime } from "luxon";
import * as cron from "node-cron";
import path from "path";
import { refreshAccessToken } from "./zaloTokenService";

const tokenFilePath = path.join(__dirname, "./token.json");

export const readTokenFromFile = () => {
  if (fs.existsSync(tokenFilePath)) {
    const tokenData = fs.readFileSync(tokenFilePath, "utf8");
    return JSON.parse(tokenData);
  }
  return null;
};

const getVietnamTimeAsDate = (timeInMs: number) => {
  return DateTime.fromMillis(timeInMs).setZone("Asia/Ho_Chi_Minh").toJSDate();
};

export const scheduleTokenRefresh = async () => {
  const tokenData = readTokenFromFile();
  if (!tokenData.access_token) {
    console.log("Token not found. Please obtain a token first.");
    return;
  }

  const { created_at, expires_in } = tokenData;
  const createdAtTime = DateTime.fromISO(created_at, {
    zone: "Asia/Ho_Chi_Minh",
  }).toMillis();

  const isExpired = Date.now() >= createdAtTime + expires_in * 1000;

  if (isExpired) {
    console.log("Mã thông báo đã hết hạn. Đang làm mới...");
    await refreshAccessToken(tokenData.refresh_token);
  } else {
    console.log("Token vẫn hợp lệ.");

    const refreshTime = createdAtTime + expires_in * 1000 - 3600000;
    const vietnamRefreshTime = getVietnamTimeAsDate(refreshTime);

    const now = DateTime.now().setZone("Asia/Ho_Chi_Minh").toMillis();
    const delay = refreshTime - now;

    if (delay > 0) {
      const cronExpression = `${vietnamRefreshTime.getMinutes()} ${vietnamRefreshTime.getHours()} ${vietnamRefreshTime.getDate()} ${
        vietnamRefreshTime.getMonth() + 1
      } *`;
      cron.schedule(cronExpression, async () => {
        console.log("Token sắp hết hạn. Đang làm mới...");
        await refreshAccessToken(tokenData.refresh_token);
      });

      console.log(`Token sẽ được làm mới lúc ${vietnamRefreshTime}.`);
    } else {
      console.log("Token đã hết hạn. Đang làm mới ngay lập tức...");
      await refreshAccessToken(tokenData.refresh_token);
    }
  }
};
