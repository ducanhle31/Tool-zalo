import mongoose from "mongoose";

const FacilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, required: false, default: "active" },
    metadata: { type: Object, required: false, default: {} },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  { timestamps: true }
);

export const Facility = mongoose.model("facility", FacilitySchema);
