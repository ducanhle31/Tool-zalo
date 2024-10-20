import { Router } from "express";
import campaignsResultController from "../controllers/campaign-result.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const campaignsresultRoutes = Router();

campaignsresultRoutes.get("/", validateAccessToken, campaignsResultController.get);

export { campaignsresultRoutes };
