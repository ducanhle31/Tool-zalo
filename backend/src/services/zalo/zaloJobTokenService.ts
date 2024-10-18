import fs from "fs";
import { DateTime } from "luxon";
import * as cron from "node-cron";
import path from "path";
import { refreshAccessToken } from "./zaloTokenService";

const tokenFilePath = path.join(__dirname, "./token.json");
// Hàm đọc token từ file JSON
const readTokenFromFile = () => {
  if (fs.existsSync(tokenFilePath)) {
    const tokenData = fs.readFileSync(tokenFilePath, "utf8");
    return JSON.parse(tokenData);
  }
  return null;
};

// Hàm lấy thời gian hiện tại ở múi giờ Việt Nam
const getVietnamTimeAsDate = (timeInMs: number) => {
  return DateTime.fromMillis(timeInMs).setZone("Asia/Ho_Chi_Minh").toJSDate();
};

export const scheduleTokenRefresh = async () => {
  const tokenData = readTokenFromFile();
  if (!tokenData) {
    console.log("Token not found. Please obtain a token first.");
    return;
  }

  const { created_at, expires_in } = tokenData;
  const createdAtTime = DateTime.fromISO(created_at, {
    zone: "Asia/Ho_Chi_Minh",
  }).toMillis();

  // Check if the token is expired
  const isExpired = Date.now() >= createdAtTime + expires_in * 1000;

  if (isExpired) {
    console.log("Mã thông báo đã hết hạn. Đang làm mới...");
    await refreshAccessToken(tokenData.refresh_token);
  } else {
    console.log("Token vẫn hợp lệ.");

    // Calculate refresh time (1 hour before expiry) in Vietnam time
    const refreshTime = createdAtTime + expires_in * 1000 - 3600000;
    const vietnamRefreshTime = getVietnamTimeAsDate(refreshTime);

    const now = DateTime.now().setZone("Asia/Ho_Chi_Minh").toMillis();
    const delay = refreshTime - now;

    // If the refresh time is in the future, schedule the cron job
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
