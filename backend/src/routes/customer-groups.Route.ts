import { Router } from "express";
import customerGroupsController from "../controllers/customer-groups.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const customerGroupRoutes = Router();

customerGroupRoutes.get("/", validateAccessToken, customerGroupsController.get);
customerGroupRoutes.get(
  "/:id",
  validateAccessToken,
  customerGroupsController.getDetail
);
customerGroupRoutes.post(
  "/",
  validateAccessToken,
  customerGroupsController.create
);
customerGroupRoutes.put(
  "/:id",
  validateAccessToken,
  customerGroupsController.update
);
customerGroupRoutes.delete(
  "/:id",
  validateAccessToken,
  customerGroupsController.delete
);

export { customerGroupRoutes };
