import { Request, Response } from "express";
import { Campaign } from "../models/campaign.Model";
import { Customer } from "../models/customer.Model";
import { zaloTemplates } from "./zalo-templates.Controller";

const sendZns = ({
  templateType,
  customers,
  startAt,
  cb,
}: {
  templateType: "discout" | "welcome";
  customers: any;
  startAt: Date | string;
  cb: (param: { fails: {} }) => void;
}) => {
  console.log(customers, startAt, templateType);
  cb({ fails: {} });
};

const cencelSendZns = (id: string) => {
  console.log(id);
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
      const zaloTemplate = zaloTemplates?.find(
        (item) => item._id === campaign?.template
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

      status === "active" &&
        template === "" &&
        sendZns({
          templateType: "discout",
          customers,
          startAt,
          cb: (fails: {}) => {},
        });

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

      status === "active" &&
        template === "" &&
        sendZns({ templateType: "discout", customers, startAt, cb: () => {} });

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
