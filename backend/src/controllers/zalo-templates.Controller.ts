import axios from "axios";
import { Request, Response } from "express";
import { readTokenFromFile } from "../services/zalo/zaloJobTokenService";

class ZaloTemplatesController {
  constructor() {
    this.get = this.get.bind(this);
    this.getDetail = this.getDetail.bind(this);
  }

  public async fetchTemplates(): Promise<any> {
    const tokenData = readTokenFromFile();
    try {
      const response = await axios.get(
        "https://business.openapi.zalo.me/template/all?offset=0&limit=100&status=1",
        {
          headers: {
            "Content-Type": "application/json",
            access_token: tokenData.access_token,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching Zalo templates:", error);
      throw new Error("Failed to fetch Zalo templates");
    }
  }

  public async get(req: Request, res: Response) {
    try {
      const zaloTemplates = await this.fetchTemplates();
      return res.json({ zaloTemplates, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error, ok: false });
    }
  }

  public async getDetail(req: Request, res: Response) {
    const templateId = req.params.id;
    const tokenData = readTokenFromFile();
    try {
      const response = await axios.get(
        "https://business.openapi.zalo.me/template/info",
        {
          headers: {
            "Content-Type": "application/json",
            access_token: tokenData.access_token,
          },
          params: {
            template_id: templateId,
          },
        }
      );

      return res.json({ template: response.data.data, ok: true });
    } catch (error) {
      console.error("Error fetching Zalo template details:", error);
      res.status(500).send({ error: error, ok: false });
    }
  }
}

export default new ZaloTemplatesController();
