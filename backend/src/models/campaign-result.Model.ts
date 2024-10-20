import mongoose from "mongoose";

const CampaignResultSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    template: { type: String },
    status: { type: String },
    createdAt: { type: Date },
    campaign_name: { type: String, required: true },
    campaign_id: { type: String, required: true },
  },
  { timestamps: true }
);

export const CampaignResult = mongoose.model(
  "campaign_result",
  CampaignResultSchema
);
