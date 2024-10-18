import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, default: "product" },
    description: { type: String, required: true, default: "" },
    short_description: { type: String, required: true, default: "" },
    status: { type: String, required: true, default: "active" },
    price: {
      member: {
        original: { type: Number, required: true },
        promotional: { type: Number, required: true },
      },
      normal: {
        original: { type: Number, required: true },
        promotional: { type: Number, required: true },
      },
    },
    metadata: { type: Object, required: false, default: {} },
    facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: "facility" }],
    descriptions: { type: String, required: false, default: "" },
    categories: { type: Array, required: false, default: [] },
  },
  { timestamps: true }
);

export const Product = mongoose.model("product", ProductSchema);
