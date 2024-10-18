import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { TransactionType } from "../models/transaction-types.Model";
import { Transaction } from "../models/transaction.Model";
import { Wallet } from "../models/wallet.Model";

class TransactionsController {
  public async get(req: Request, res: Response) {
    const walletId = req.query?.wallet as string;

    try {
      if (walletId) {
        const wallet = await Wallet.findById(walletId);
        if (wallet) {
          const transactions = await Transaction.find({
            wallet: new ObjectId(walletId),
          })
            .populate("customer")
            .populate("wallet")
            .sort({ createdAt: -1 });

          return res.json({
            transactions,
            total: transactions?.length || 0,
            ok: true,
          });
        }
      }

      const transactions = await Transaction.find()
        .populate("customer")
        .populate("wallet")
        .sort({ createdAt: -1 });

      return res.json({
        transactions,
        total: transactions?.length || 0,
        ok: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server khi lấy danh sách giao dịch" });
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const transaction = await Transaction.findById(id)
        .populate("customer")
        .populate("wallet")
        .populate("facility")
        .populate("transaction_type")
        .populate("transaction_form");

      return res.json({ transaction, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server khi lấy thông tin giao dịch" });
    }
  }

  public async create(req: Request, res: Response) {
    const transaction = req.body;

    const wallet = transaction?.wallet;
    const walletObject = await Wallet.findById(wallet);
    const transaction_type = transaction?.transaction_type;
    const transaction_form = transaction?.transaction_form;
    const previous_balance = walletObject?.toObject()?.current_balance;
    const value = transaction?.value;
    const status = transaction?.status || "completed";

    try {
      if (typeof value !== "number") {
        return res.json({
          error: "Giá trị giao dịch không hợp lệ",
          error_type: "type",
        });
      }

      if (!walletObject) {
        return res.json({
          error: "Không tồn tại thẻ thành viên của giao dịch này",
          error_type: "type",
        });
      }

      if (!wallet || !transaction_type || !transaction_form || !value) {
        return res.json({
          error: "Thiếu thông tin tạo giao dịch",
          error_type: "require",
        });
      }

      const transactionType = TransactionType.findById(transaction_type);
      const transactionForm = TransactionType.findById(transaction_form);

      if (!transactionForm || !transactionType) {
        return res.json({
          error:
            "Thông tin loại giao dịch và phương thức giao dịch không được hỗ trợ!",
          error_type: "type",
        });
      }

      const current_balance: number = Number(previous_balance) + value;

      if (current_balance < 0) {
        return res.json({
          error: "Số dư không đủ để thực hiện giao dịch",
        });
      }

      const result = await Transaction?.insertMany({
        ...transaction,
        status,
        previous_balance,
      });

      await Wallet.updateOne({ _id: walletObject._id }, { current_balance });

      return res.json({ result, ok: true });
    } catch (error) {
      return res.json({ error: "Lỗi tạo giao dịch " + error });
    }
  }

  public async update(req: Request, res: Response) {
    const _id = req?.params?.id;
    const transaction = req?.body;
    const title = transaction?.title;
    const note = transaction?.note;

    try {
      const currentTransaction = await Transaction.findById(_id);
      if (!currentTransaction)
        return res.json({
          error: "Không tồn tại giao dịch cần update",
        });

      const result = await Transaction.updateOne(
        {
          _id,
        },
        {
          title: title || currentTransaction?.title,
          note: note || currentTransaction?.note,
        }
      );

      return res.json({ result, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server khi update thẻ thành viên" });
    }
  }
}

export default new TransactionsController();
