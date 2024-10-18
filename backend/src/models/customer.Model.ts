import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: null },
    is_follow_oa: { type: Boolean, default: false },
    address: {
      type: {
        country: { type: String, required: true },
        province: { type: String, required: true },
        district: { type: String, required: true },
        town: { type: String, required: true },
        free_note: { type: String, required: false, default: "" },
      },
      require: true,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wallet",
      default: null,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
    facilities: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "facility" }],
      default: null,
    },
    customer_groups: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "customer_group",
        },
      ],
      default: null,
    },
    status: { type: String, required: false, default: "active" },
    metadata: { type: Object, required: false, default: {} },
    birth: { type: String, require: true },
    gender: { type: String, require: true },

    custom_date: { type: String, require: true },
    customer_name: { type: String, require: true },
    order_code: { type: String, require: true },
    price_number: { type: String, require: true },
    tuition_code: { type: String, require: true },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("customer", CustomerSchema);
