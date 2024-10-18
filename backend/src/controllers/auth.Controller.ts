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

    await currentUser.save();

    return res.json({
      user: { ...currentUser, password: undefined },
      ok: true,
    });
  }
}

export default new AuthController();
