import { Router } from "express";
import transactionsController from "../controllers/transactions.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const transactionsRouter = Router();

transactionsRouter.get("/", validateAccessToken, transactionsController.get);
transactionsRouter.get(
  "/:id",
  validateAccessToken,
  transactionsController.getDetail
);
transactionsRouter.post(
  "/",
  validateAccessToken,
  transactionsController.create
);
transactionsRouter.put(
  "/:id",
  validateAccessToken,
  transactionsController.update
);

export { transactionsRouter };
