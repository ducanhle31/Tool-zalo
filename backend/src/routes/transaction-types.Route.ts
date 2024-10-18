import { Router } from "express";
import transactionTypesController from "../controllers/transaction-types.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const transactionTypesRouter = Router();

transactionTypesRouter.get(
  "/",
  validateAccessToken,
  transactionTypesController.get
);
transactionTypesRouter.post(
  "/",
  validateAccessToken,
  transactionTypesController.create
);
transactionTypesRouter.get(
  "/:id",
  validateAccessToken,
  transactionTypesController.getDetail
);

transactionTypesRouter.delete(
  "/:id",
  validateAccessToken,
  transactionTypesController.delete
);

export { transactionTypesRouter };
