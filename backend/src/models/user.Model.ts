import moment from "moment-timezone";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user_name: { type: String, required: true },
    password: { type: String, required: true },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "facility",
      default: null,
    },
    role: { type: String, required: false, default: null },
    token: { type: String, required: false, default: null },
    status: { type: String, required: false, default: "active" },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const nowInUtc7 = moment().tz("Asia/Bangkok").toDate();

  if (!this.createdAt) {
    this.createdAt = nowInUtc7;
  }
  this.updatedAt = nowInUtc7;
  next();
});

export const User = mongoose.model("user", UserSchema);
