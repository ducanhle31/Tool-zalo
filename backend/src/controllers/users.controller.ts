import { Request, Response } from "express";
import { User } from "../models/user.Model";

class UsersController {
  public async get(req: Request, res: Response) {
    try {
      const user = await User.find();
      return res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
}

export default new UsersController();
