import { Request, Response } from "express";
import { User } from "../models/user.Model";

class AuthController {
  public async login(req: Request, res: Response) {
    const userBody = req.body as unknown as {
      user_name: string;
      password: string;
    };

    if (!userBody || !userBody.user_name || !userBody.password) {
      return res.status(400).json({
        error: "Missing user name or password",
      });
    }

    const currentUser = await User.findOne({
      user_name: userBody.user_name,
      password: userBody.password,
    });

    if (!currentUser) {
      return res.status(401).json({
        error: "Invalid user name or password",
      });
    }

    return res.json({
      user: {
        _id: currentUser.toObject()._id,
        user_name: currentUser.toObject().user_name,
        name: currentUser.toObject().name,
        token: currentUser.toObject().token,
        facility: currentUser.toObject().facility,
        role: currentUser.toObject().role,
        status: currentUser.toObject().status,
      },
      ok: true,
    });
  }
}

export default new AuthController();
