import { Request, Response } from "express";
import { Product } from "../models/product.Model";

class ProductsController {
  public async get(req: Request, res: Response) {
    try {
      const data = await Product.find();
      return res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const data = await Product.findById(id);
      return res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
}

export default new ProductsController();
