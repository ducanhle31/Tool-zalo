import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: false, default: "active" },
    startAt: {
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: function (v: any) {
          return typeof v === "string" || v instanceof Date;
        },
        message: (props: { value: any }) =>
          `${props.value} is not a valid type!`,
      },
    },
    customer_groups: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "customer_group",
        },
      ],
      require: true,
    },

    template: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const Campaign = mongoose.model("campaign", campaignSchema);
