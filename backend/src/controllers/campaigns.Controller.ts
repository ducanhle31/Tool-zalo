import { Request, Response } from "express";
import { Campaign } from "../models/campaign.Model";
import { Customer } from "../models/customer.Model";
import { scheduledJobs, scheduleZns } from "../services/zalo/zaloZns";
import zaloTemplatesController from "./zalo-templates.Controller";

const cencelSendZns = (campaignId: string) => {
  const job = scheduledJobs.get(campaignId);

  if (job) {
    job.stop();
    scheduledJobs.delete(campaignId);
    console.log(`Canceled scheduled ZNS for campaign ID: ${campaignId}`);
  } else {
    console.log(`No scheduled ZNS found for campaign ID: ${campaignId}`);
  }
};

class CampaignsController {
  public async get(req: Request, res: Response) {
    try {
      const campaigns = await Campaign.find();
      return res.json({ campaigns, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const campaign = await Campaign.findById(id).populate("customer_groups");
      const templatesResponse = await zaloTemplatesController.fetchTemplates();
      const zaloTemplate = templatesResponse.find(
        (item: any) => item.template === Number(campaign?.template)
      );
      return res.json({
        campaign: { ...campaign?.toObject(), template: zaloTemplate },
        ok: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
  public async create(req: Request, res: Response) {
    const campaign = req.body;
    const name = campaign?.name;
    const description = campaign?.description;
    const status = campaign?.status || "active";
    const template = campaign?.template;
    const startAt = campaign?.startAt;
    if (!name || !description) {
      return res.json({
        error: "Thiếu thông tin tạo chiến dịch",
        error_type: "require",
      });
    }
    0;

    try {
      const groupSame = await Campaign.findOne({ name });
      if (groupSame) {
        return res.json({
          error: "Trùng thông tin tên chiến dịch",
          error_type: "same",
        });
      }
      const result = await Campaign?.insertMany({
        ...campaign,
        name,
        description,
        status,
      });
      const customers = await Customer.find({
        customer_groups: { $in: campaign?.customer_groups },
      });

      if (status === "active" && template) {
        scheduleZns({ template, customers, name, startAt, _id: result[0]._id });
      }
      return res.json({ result, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async update(req: Request, res: Response) {
    const _id = req?.params?.id;
    const campaign = req.body;
    const status = campaign?.status;
    const template = campaign?.template;
    const startAt = campaign?.startAt;
    const templateType = campaign?.templateType;
    const name = campaign?.name;

    delete campaign?._id;

    if (!_id)
      return res.status(500).json({ error: "Không có tham số _id truyền lên" });

    try {
      const result = await Campaign.findOneAndUpdate({ _id }, { ...campaign });

      if (!result)
        return res
          .status(500)
          .json({ error: "Không tìm thấy campaign cần update" });

      cencelSendZns("id");

      const customers = await Customer.find({
        customer_groups: { $in: campaign?.customer_groups },
      });

      // status === "active" &&
      //   template === "" &&
      //   sendZns({ template, customers, startAt, cb: () => {} });
      if (status === "active" && template) {
        scheduleZns({ template, customers, name, startAt, _id });
      }
      return res.status(200).json({ campaign: result, ok: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Lỗi khi update campaign" });
    }
  }

  public async delete(req: Request, res: Response) {
    const _id = req?.params?.id;

    if (!_id)
      return res.status(500).json({ error: "Không có tham số _id truyền lên" });
    try {
      const result = await Campaign.findOneAndDelete({ _id });
      cencelSendZns("id");

      if (result) return res.status(200).json({ customer: result, ok: true });
      return res.status(500).json({ error: "Không tìm thấy campaign cần xóa" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Lỗi khi update campaign" });
    }
  }
}

export default new CampaignsController();
