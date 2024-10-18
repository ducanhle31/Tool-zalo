import { Router } from "express";
import product_categoriesController from "../controllers/product-categories.Controller";

const productCatsRouter = Router();

productCatsRouter.get("/", product_categoriesController.get);
productCatsRouter.get("/:id", product_categoriesController.getDetail);

export { productCatsRouter };
