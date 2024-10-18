import { Request, Response } from "express";
import { CustomerGroup } from "../models/customer-group.Model";

class CustomerGroupsController {
  public async get(req: Request, res: Response) {
    try {
      const customer_groups = await CustomerGroup.find();
      return res.json({ customer_groups, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const customer_group = await CustomerGroup.findById(id);
      return res.json({ customer_group, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async create(req: Request, res: Response) {
    const customer_group = req.body;

    const name = customer_group?.name;
    const slug = customer_group?.slug || "";
    const description = customer_group?.description;
    const status = customer_group?.status || "active";

    if (!name || !description) {
      return res.json({
        error: "Thiếu thông tin tạo nhóm khách hàng",
        error_type: "require",
      });
    }

    try {
      const groupSame = await CustomerGroup.findOne({ name });
      if (groupSame) {
        return res.json({
          error: "Trùng thông tin tên nhóm",
          error_type: "same",
        });
      }
      const result = await CustomerGroup?.insertMany({
        ...customer_group,
        name,
        slug,
        description,
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
      const result = await CustomerGroup.findOneAndUpdate(
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
      const result = await CustomerGroup.findOneAndDelete({ _id });

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

export default new CustomerGroupsController();
