import mongoose from "mongoose";

const TransactionFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    qrcode: {
      type: String,
      require: false,
      default: null,
    },
    status: { type: String, required: false, default: "pending" },
    metadata: { type: Object, required: false, default: {} },
  },
  { timestamps: true }
);

export const TransactionForm = mongoose.model(
  "transaction_form",
  TransactionFormSchema
);
