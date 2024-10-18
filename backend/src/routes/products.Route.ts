import { Router } from "express";
import productsController from "../controllers/products.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const productsRouter = Router();

productsRouter.get("/", validateAccessToken, productsController.get);
productsRouter.get("/:id", validateAccessToken, productsController.getDetail);

export { productsRouter };
