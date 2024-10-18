import { Request, Response } from "express";

export const zaloTemplates = [
  {
    _id: "1",
    name: "Khuyến mãi giảm giá",
    description: "Khuyến mãi giảm giá",
  },

  {
    _id: "2",
    name: "Thông báo mới",
    description: "Thông báo mới",
  },

  {
    _id: "3",
    name: "Thông báo đơn hàng",
    description: "Thông báo đơn hàng",
  },
];

class zaloTemplatesController {
  public async get(req: Request, res: Response) {
    try {
      return res.json({ zaloTemplates, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const zaloTemplate = zaloTemplates?.find((item) => item._id === id);
      return res.json({ zaloTemplate, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
}

export default new zaloTemplatesController();
