import { Router } from "express";
import campaignsController from "../controllers/campaigns.Controller";
import campaignsResultController from "../controllers/campaign-result.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const campaignsRoutes = Router();

campaignsRoutes.get("/", validateAccessToken, campaignsController.get);
campaignsRoutes.get("/:id", validateAccessToken, campaignsController.getDetail);
campaignsRoutes.put("/:id", validateAccessToken, campaignsController.update);
campaignsRoutes.delete("/:id", validateAccessToken, campaignsController.delete);
campaignsRoutes.post("/", validateAccessToken, campaignsController.create);

export { campaignsRoutes };
