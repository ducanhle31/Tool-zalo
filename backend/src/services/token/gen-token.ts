import crypto from "crypto";

export const genToken = () => {
  return crypto.randomBytes(16).toString("hex");
};
