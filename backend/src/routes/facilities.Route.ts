import { Router } from "express";
import facilitiesController from "../controllers/facilities.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const facilitiesRouter = Router();

facilitiesRouter.get("/", validateAccessToken, facilitiesController.get);
facilitiesRouter.post("/", validateAccessToken, facilitiesController.create);
facilitiesRouter.get(
  "/:id",
  validateAccessToken,
  facilitiesController.getDetail
);
facilitiesRouter.delete(
  "/:id",
  validateAccessToken,
  facilitiesController.delete
);

export { facilitiesRouter };
