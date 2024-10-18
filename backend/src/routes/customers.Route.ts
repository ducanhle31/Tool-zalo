import multer from "multer";

import { Router } from "express";
import customersController from "../controllers/customers.controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const upload = multer({ dest: "uploads/" });

const customerRoutes = Router();

customerRoutes.get("/", validateAccessToken, customersController.get);
customerRoutes.get("/export", customersController.exportTemplate);
customerRoutes.get("/:id", validateAccessToken, customersController.getDetail);
customerRoutes.put("/:id", validateAccessToken, customersController.update);
customerRoutes.delete("/:id", validateAccessToken, customersController.delete);
customerRoutes.post("/", validateAccessToken, customersController.create);
customerRoutes.post(
  "/delete-bulk",
  validateAccessToken,
  customersController.deleteBulk
);
customerRoutes.post(
  "/import",
  upload.single("file"),
  validateAccessToken,
  customersController.import
);
customerRoutes.post("/export", validateAccessToken, customersController.export);

export { customerRoutes };
