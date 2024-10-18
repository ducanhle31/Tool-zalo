import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { commonRouter } from "./routes";
import { connectDb } from "./services/mongodb/connect";
import { scheduleTokenRefresh } from "./services/zalo/zaloJobTokenService";
import { scheduleZNS } from "./services/zalo/zns.Service";

connectDb();

// to read all env variable in .env file
dotenv.config();

const app = express();

app.use(express.json());

// use morgan to log all request
app.use(morgan("combined"));

// use cors to allow all domain to access this server
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin === process.env.ADMIN_URL || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// use body parse to read body from request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set public folder as static folder
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// use all routers of backend
app.use("/api/v1", commonRouter);

// chạy hàm này để làm mới token tự động
// scheduleTokenRefresh();
// hàm gửi tin
// scheduleZNS();

const port = 3006;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
