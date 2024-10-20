import { Request, Response } from "express";
import { CampaignResult } from "../models/campaign-result.Model";

class CampaignsResultController {
  public async get(req: Request, res: Response) {
    try {
      const campaignsresult = await CampaignResult.find();
      return res.json({ campaignsresult, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
}

export default new CampaignsResultController();
