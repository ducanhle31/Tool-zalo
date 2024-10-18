import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { TransactionForm } from "../models/transaction-forms.Model";
import { Transaction } from "../models/transaction.Model";

class TransactionFormsController {
  public async get(req: Request, res: Response) {
    try {
      const transactionForms = await TransactionForm.find();

      return res.json({
        transactionForms,
        total: transactionForms?.length || 0,
        ok: true,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Lỗi server khi lấy danh sách phương thức giao dịch" });
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const transactionForm = await TransactionForm.findById(id);

      return res.json({ transactionForm, ok: true });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Lỗi server khi lấy thông tin phương thức giao dịch" });
    }
  }

  public async create(req: Request, res: Response) {
    const transactionForm = req.body;
    const name = transactionForm?.name;
    const status = transactionForm?.status || "active";

    if (!name) {
      return res.status(500).json({
        error: "Thiếu thông tin tạo phương thức thanh toán",
        error_type: "type",
      });
    }

    const sameTransactionForm = await TransactionForm.findOne({ name });

    if (sameTransactionForm) {
      return res.status(500).json({
        error: "Đã tồn tại phương thức giao dịch trên hệ thống!",
        error_type: "same",
      });
    }

    const result = await TransactionForm?.insertMany({
      ...transactionForm,
      status,
    });

    return res.json({ result, ok: true });
  }

  public async delete(req: Request, res: Response) {
    const id = req?.params?.id;

    if (!id)
      return res
        .status(500)
        .json({ error: "Không có thông tin _id phương thức giao dịch!" });

    try {
      const currentTransactionForm = await TransactionForm.findById(id);
      if (!currentTransactionForm)
        return res
          .status(500)
          .json({ error: "Không tồn tại phương thức giao dịch cần delete!" });

      const transactionHasTransactionForm = await Transaction.findOne({
        transaction_form: new ObjectId(id),
      });

      if (transactionHasTransactionForm)
        return res.status(500).json({
          error: "Không thể xóa phương thức giao dịch đã phát sinh giao dịch!",
        });

      const result = await TransactionForm.deleteOne({ _id: new ObjectId(id) });

      return res.json({ result, ok: true });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Lỗi server khi xóa phương thức giao dịch " + error });
    }
  }
}

export default new TransactionFormsController();
