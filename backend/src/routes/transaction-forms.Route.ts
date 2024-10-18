import { Router } from "express";
import transactionFormsController from "../controllers/transaction-forms.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const transactionFormsRouter = Router();

transactionFormsRouter.get(
  "/",
  validateAccessToken,
  transactionFormsController.get
);
transactionFormsRouter.post(
  "/",
  validateAccessToken,
  transactionFormsController.create
);
transactionFormsRouter.get(
  "/:id",
  validateAccessToken,
  transactionFormsController.getDetail
);
transactionFormsRouter.delete(
  "/:id",
  validateAccessToken,
  transactionFormsController.delete
);

export { transactionFormsRouter };
