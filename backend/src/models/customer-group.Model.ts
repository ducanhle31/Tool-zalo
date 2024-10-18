import mongoose from "mongoose";

const customerGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    count: { type: Number, required: false, default: 0 },
    description: { type: String, required: true },
    status: { type: String, required: false, default: "active" },
  },
  { timestamps: true }
);

export const CustomerGroup = mongoose.model(
  "customer_group",
  customerGroupSchema
);
