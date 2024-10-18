import { Router } from "express";
import zaloTemplatesController from "../controllers/zalo-templates.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const zaloTemplatesRoutes = Router();

zaloTemplatesRoutes.get("/", validateAccessToken, zaloTemplatesController.get);
zaloTemplatesRoutes.get(
  "/:id",
  validateAccessToken,
  zaloTemplatesController.getDetail
);

export { zaloTemplatesRoutes };
