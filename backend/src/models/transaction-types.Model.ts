import mongoose from "mongoose";

const TransactionTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    value: {
      type: Number,
      require: true,
      default: -1,
    },
    status: { type: String, required: false, default: "active" },
    metadata: { type: Object, required: false, default: {} },
  },
  { timestamps: true }
);

export const TransactionType = mongoose.model(
  "transaction_type",
  TransactionTypeSchema
);
