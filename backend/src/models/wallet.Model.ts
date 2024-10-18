import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    status: { type: String, required: true, default: "active" },
    metadata: { type: Object, required: false, default: {} },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },
    current_balance: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model("wallet", WalletSchema);
