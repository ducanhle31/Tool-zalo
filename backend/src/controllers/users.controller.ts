import { Request, Response } from "express";
import { Facility } from "../models/facility.Model";
import { User } from "../models/user.Model";
import { genToken } from "../services/token/gen-token";

class UsersController {
  public async get(req: Request, res: Response) {
    try {
      const users = await User.find().sort({ createdAt: -1 });

      return res.json({
        users,
        total: users?.length || 0,
        ok: true,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Lỗi get users " + error?.message });
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const user = await User.findById(id).populate("facility");
      return res.json({ user, ok: true });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Lỗi khi get user! " + error?.message });
    }
  }

  public async create(req: Request, res: Response) {
    const user = req.body;

    const name = user?.name;
    const user_name = user?.user_name;
    const password = user?.password;
    const facilityId = user?.facility;
    const status = user?.status || "active";
    user.token = genToken();

    if (!name || !user_name || !password || !facilityId) {
      return res.json({
        error: "Thiếu thông tin tạo người dùng!",
        error_type: "require",
      });
    }

    const facilityDoc = await Facility?.findById(facilityId);

    if (!facilityDoc) {
      return res.json({
        error: "Thông tin nguồn khi tạo user không khớp!",
        error_type: "require",
      });
    }

    try {
      const userSame = await User.findOne({ user_name });
      if (userSame) {
        return res.status(500).json({
          error: "Trùng thông tin user name khi tạo tài khoản!",
          error_type: "same",
        });
      }
      const result = await User?.create({
        ...user,
        facility: facilityId,
        status,
      });

      return res.json({ result, ok: true });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Lỗi khi tạo user! " + error?.message });
    }
  }

  public async update(req: Request, res: Response) {
    const _id = req?.params?.id;
    const userUpdate = req.body;
    delete userUpdate?._id;

    if (!_id)
      return res
        .status(500)
        .json({ error: "Không có tham số _id truyền lên khi update user" });

    try {
      const result = await User.findOneAndUpdate({ _id }, { ...userUpdate });

      if (result) return res.status(200).json({ user: result, ok: true });

      return res.status(500).json({ error: "Không tìm thấy user cần update" });
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Lỗi khi update user! " + error?.message });
    }
  }

  public async delete(req: Request, res: Response) {
    const _id = req?.params?.id;

    if (!_id)
      return res
        .status(500)
        .json({ error: "Không có tham số _id truyền lên khi xóa user!" });

    try {
      const result = await User.findOneAndDelete({ _id });

      if (result) return res.status(200).json({ customer: result, ok: true });
      return res.status(500).json({ error: "Không tìm thấy user cần xóa" });
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Lỗi khi xóa user! " + error?.message });
    }
  }
}

export default new UsersController();
