import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { TransactionType } from "../models/transaction-types.Model";
import { Transaction } from "../models/transaction.Model";

class TransactionTypesController {
  public async get(req: Request, res: Response) {
    try {
      const transactionTypes = await TransactionType.find();

      return res.json({
        transactionTypes,
        total: transactionTypes?.length || 0,
        ok: true,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Lỗi server khi lấy danh sách loại giao dịch" });
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const transactionType = await TransactionType.findById(id);

      return res.json({ transactionType, ok: true });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Lỗi server khi lấy thông tin loại giao dịch" });
    }
  }

  public async create(req: Request, res: Response) {
    const transactionType = req.body;
    const name = transactionType?.name;
    const description = transactionType?.description;
    const status = transactionType?.status || "active";
    const value = transactionType?.value;

    if (!name || !description || !value) {
      return res.json({
        error: "Thiếu thông tin tạo loại giao dịch",
        error_type: "type",
      });
    }

    const sameTransactionType = await TransactionType.findOne({ name });

    if (sameTransactionType) {
      return res.status(500).json({
        error: "Đã tồn tại loại giao dịch trên hệ thống!",
        error_type: "same",
      });
    }

    if (value !== 1 && value !== -1) {
      return res.json({
        error: "Giá trị loại giao dịch chỉ là 1 hoặc -1 không có giá trị khác",
        error_type: "type",
      });
    }

    const result = await TransactionType?.insertMany({
      ...transactionType,
      status,
    });

    return res.json({ result, ok: true });
  }

  public async delete(req: Request, res: Response) {
    const id = req?.params?.id;

    if (!id)
      return res
        .status(500)
        .json({ error: "Không có thông tin _id loại giao dịch cần xóa!" });

    try {
      const currentTransactionType = await TransactionType.findById(id);
      if (!currentTransactionType)
        return res
          .status(500)
          .json({ error: "Không tồn tại loại giao dịch cần delete!" });

      const transactionHasTransactionType = await Transaction.findOne({
        transaction_type: new ObjectId(id),
      });

      if (transactionHasTransactionType)
        return res.status(500).json({
          error: "Không thể xóa loại giao dịch đã phát sinh giao dịch!",
        });

      const result = await TransactionType.deleteOne({ _id: new ObjectId(id) });

      return res.json({ result, ok: true });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Lỗi server khi xóa loại giao dịch " + error });
    }
  }
}

export default new TransactionTypesController();
