import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user_name: { type: String, required: true },
    password: { type: String, required: true },
    facility: { type: mongoose.Schema.Types.ObjectId, ref: "facility" },
    token: { type: String, required: false, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model("user", UserSchema);
