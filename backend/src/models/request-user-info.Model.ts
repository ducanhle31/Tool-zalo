import mongoose from "mongoose";

const RequestUserInfoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image_url: { type: String, required: true },
  },
  { timestamps: true }
);

export const RequestUserInfo = mongoose.model(
  "request_user_info",
  RequestUserInfoSchema
);
