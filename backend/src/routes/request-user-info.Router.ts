import { Router } from "express";
import { validateAccessToken } from "../middleware/auth.Middleware";
import requestUserInfoController from "../controllers/request-user-info.Controller";

const requestUserInfoRoutes = Router();

requestUserInfoRoutes.get(
  "/",
  validateAccessToken,
  requestUserInfoController.get
);
requestUserInfoRoutes.get(
  "/:id",
  validateAccessToken,
  requestUserInfoController.getDetail
);
requestUserInfoRoutes.post(
  "/",
  validateAccessToken,
  requestUserInfoController.create
);
requestUserInfoRoutes.put(
  "/:id",
  validateAccessToken,
  requestUserInfoController.update
);
requestUserInfoRoutes.delete(
  "/:id",
  validateAccessToken,
  requestUserInfoController.delete
);

export { requestUserInfoRoutes };
