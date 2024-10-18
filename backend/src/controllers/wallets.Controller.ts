import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Customer } from "../models/customer.Model";
import { Wallet } from "../models/wallet.Model";

class WalletsController {
  public async get(req: Request, res: Response) {
    const hasCancel = req.query?.has_cancel;

    try {
      if (hasCancel) {
        const wallets = await Wallet.find()
          .populate("customer")
          .sort({ createdAt: -1 });

        return res.json({
          wallets,
          total: wallets?.length || 0,
          ok: true,
        });
      }
      const wallets = await Wallet.find({ status: { $ne: "cancel" } })
        .populate("customer")
        .sort({ createdAt: -1 });

      return res.json({
        wallets,
        total: wallets?.length || 0,
        ok: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Lỗi khi get thẻ thành viên  ${error}` });
    }
  }

  public async getNotCancel(req: Request, res: Response) {
    try {
      const wallets = await Wallet.find({ status: { $ne: "cancel" } })
        .populate("customer")
        .sort({ createdAt: -1 });

      return res.json({
        wallets,
        total: wallets?.length || 0,
        ok: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const wallet = await Wallet.findById(id).populate("customer");

      return res.json({ wallet, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async create(req: Request, res: Response) {
    const wallet = req.body;

    const customer = wallet?.customer;
    const status = customer?.status || "active";

    if (!customer) {
      return res.json({
        error: "Thiếu thông tin tạo thẻ thành viên",
        error_type: "require",
      });
    }

    try {
      const hasWallet = await Wallet.findOne({
        customer: new ObjectId(customer),
      });

      if (hasWallet) {
        return res.json({
          error: "Khách hàng này đã có thẻ thành viên",
          error_type: "same",
        });
      }
      const result = await Wallet?.insertMany({
        ...wallet,
        status,
        current_balance: 0,
      });

      if (result && result[0]) {
        await Customer.updateOne(
          { _id: new ObjectId(customer) },
          {
            wallet: result[0]?._id,
          }
        );
      }

      return res.json({ result, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server khi tạo thẻ thành viên" });
    }
  }

  public async update(req: Request, res: Response) {
    const _id = req?.params?.id;
    const wallet = req?.body;
    const status = wallet?.status;
    const metadata = wallet?.metadata;

    try {
      const currentWallet = await Wallet.findById(_id);
      if (!currentWallet)
        return res.json({ error: "Không tồn tại thẻ thành viên cần update" });

      const result = await Wallet.updateOne(
        {
          _id,
        },
        {
          status: status || currentWallet.status,
          metadata: { ...currentWallet?.metadata, ...metadata },
        }
      );

      return res.json({ result, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server khi update thẻ thành viên" });
    }
  }

  public async delete(req: Request, res: Response) {
    const _id = req?.params?.id;

    if (!_id)
      return res.status(500).json({ error: "Không có tham số _id truyền lên" });

    try {
      const result = await Wallet.findOneAndDelete({ _id });

      if (result) return res.status(200).json({ wallet: result, ok: true });
      return res
        .status(500)
        .json({ error: "Không tìm thấy thẻ thành viên cần xóa" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Lỗi khi update thẻ thành viên" });
    }
  }
}

export default new WalletsController();
