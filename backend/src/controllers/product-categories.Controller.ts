import { Request, Response } from "express";
import { ProductCat } from "../models/product-category.Model";

class ProductCategoriesController {
  public async get(req: Request, res: Response) {
    try {
      const data = await ProductCat.find();
      return res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const data = await ProductCat.findById(id);
      return res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
}

export default new ProductCategoriesController();
