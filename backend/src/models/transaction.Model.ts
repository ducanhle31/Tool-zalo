import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    note: { type: String, require: false, default: "" },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wallet",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "facility",
      required: false,
      default: null,
    },
    transaction_form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction_form",
    },
    value: { type: Number, required: true },
    transaction_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction_type",
    },
    status: { type: String, required: false, default: "completed" },
    metadata: { type: Object, required: false, default: {} },
    previous_balance: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("transaction", TransactionSchema);
