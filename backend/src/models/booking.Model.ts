import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, default: "" },
    phone: { type: String, required: true },
    email: { type: String, required: false, default: "" },
    status: { type: String, required: true, default: "active" },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: false,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    time_arrived: { type: Date, required: true },
    is_arrivied: { type: Boolean, required: false, default: false },
    is_phone_zalo: { type: Boolean, required: false, default: false },
    metadata: { type: Object, required: false, default: {} },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("booking", BookingSchema);
