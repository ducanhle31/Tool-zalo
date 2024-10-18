import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const fix_token = process.env.TOKEN;

export const validateAccessToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (token !== fix_token) {
    return res.status(403).json({ error: "Invalid Token" });
  }

  next();
};
