import { Router } from "express";
import walletsController from "../controllers/wallets.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const walletsRouter = Router();

walletsRouter.get("/", validateAccessToken, walletsController.get);
walletsRouter.post("/", validateAccessToken, walletsController.create);
walletsRouter.get("/:id", validateAccessToken, walletsController.getDetail);
walletsRouter.put("/:id", validateAccessToken, walletsController.update);
walletsRouter.delete("/:id", validateAccessToken, walletsController.delete);

export { walletsRouter };
