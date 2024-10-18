import { Request, Response } from "express";

class CommonsController {
  public async MethodNotAlow(req: Request, res: Response) {
    return res.status(405).json({
      error: "Method not allow",
    });
  }
}

export default new CommonsController();
