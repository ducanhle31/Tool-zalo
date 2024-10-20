import { Request, Response } from "express";
import { RequestUserInfo } from "../models/request-user-info.Model";

class RequestUserInfoController {
  public async get(req: Request, res: Response) {
    try {
      const request_user_info = await RequestUserInfo.find();
      return res.json({ request_user_info, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const request_user_info = await RequestUserInfo.findById(id);
      return res.json({ request_user_info, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async create(req: Request, res: Response) {
    const request_user_info = req.body;

    const title = request_user_info?.title;
    const subtitle = request_user_info?.subtitle || "";
    const image_url = request_user_info?.image_url;
    const status = request_user_info?.status || "active";

    if (!title || !image_url) {
      return res.json({
        error: "Thiếu thông tin tạo nhóm khách hàng",
        error_type: "require",
      });
    }

    try {
      const groupSame = await RequestUserInfo.findOne({ title });
      if (groupSame) {
        return res.json({
          error: "Trùng thông tin tên nhóm",
          error_type: "same",
        });
      }
      const result = await RequestUserInfo?.insertMany({
        ...request_user_info,
        title,
        subtitle,
        image_url,
        status,
      });

      return res.json({ result, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async update(req: Request, res: Response) {
    const _id = req?.params?.id;
    const customerUpdate = req.body;
    delete customerUpdate?._id;

    if (!_id)
      return res.status(500).json({ error: "Không có tham số _id truyền lên" });

    try {
      const result = await RequestUserInfo.findOneAndUpdate(
        { _id },
        { ...customerUpdate }
      );

      if (result) return res.status(200).json({ customer: result, ok: true });

      return res
        .status(500)
        .json({ error: "Không tìm thấy customer-group cần update" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Lỗi khi update customer-group" });
    }
  }

  public async delete(req: Request, res: Response) {
    const _id = req?.params?.id;

    if (!_id)
      return res.status(500).json({ error: "Không có tham số _id truyền lên" });

    try {
      const result = await RequestUserInfo.findOneAndDelete({ _id });

      if (result) return res.status(200).json({ customer: result, ok: true });
      return res
        .status(500)
        .json({ error: "Không tìm thấy customer-group cần xóa" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Lỗi khi update customer-group" });
    }
  }
}

export default new RequestUserInfoController();
