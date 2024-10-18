import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Customer } from "../models/customer.Model";
import { Facility } from "../models/facility.Model";
import { Transaction } from "../models/transaction.Model";

class FacilitiesController {
  public async get(req: Request, res: Response) {
    try {
      const data = await Facility.find();
      return res.json({ facilities: data, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const data = await Facility.findById(id);
      return res.json({ facilitiy: data, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  public async create(req: Request, res: Response) {
    const facility = req.body;

    const name = facility?.name;
    const phone = facility?.phone;
    const status = facility?.status || "active";

    if (!name || !phone) {
      return res.json({
        error: "Thiếu thông tin tạo cơ sở!",
        error_type: "require",
      });
    }

    try {
      const facilitySames = await Facility.find({ name }, { phone });
      if (facilitySames && facilitySames?.length) {
        return res.json({
          error: "Trùng tên hoặc số điện thoại!",
          error_type: "same",
        });
      }
      const result = await Facility?.create({
        ...facility,
        status,
      });

      return res.json({ result, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async delete(req: Request, res: Response) {
    const id = req?.params?.id;

    if (!id)
      return res.status(500).json({ error: "Không có thông tin id cơ sở!" });

    try {
      const currentFacility = await Facility.findById(id);
      if (!currentFacility)
        return res
          .status(500)
          .json({ error: "Không tồn tại cơ sở cần delete!" });

      const customerHasFacility = await Customer.findOne({
        facilities: { $in: [new ObjectId(id)] },
      });

      if (customerHasFacility)
        return res.status(500).json({
          error: "Không thể xóa cơ sở đã có khách hàng!",
        });

      const transactionHasFacility = await Transaction.findOne({
        facility: new ObjectId(id),
      });

      if (transactionHasFacility)
        return res.status(500).json({
          error: "Không thể xóa cơ sở đã có giao dịch!",
        });

      const result = await Facility.deleteOne({ _id: new ObjectId(id) });

      return res.json({ result, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server khi xóa cơ sở " + error });
    }
  }
}

export default new FacilitiesController();
