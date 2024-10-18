import mongoose from "mongoose";

const ProductCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    count: { type: Number, required: false, default: 0 },
    parent_cat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product_category",
    },
  },
  { timestamps: true }
);

export const ProductCat = mongoose.model(
  "Product_category",
  ProductCategorySchema
);
