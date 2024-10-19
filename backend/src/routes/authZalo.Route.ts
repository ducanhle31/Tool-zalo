import { Router } from "express";
import authZaloController from "../controllers/authZalo.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const authZaloRouter = Router();

authZaloRouter.get("/login", authZaloController.authZalo);
authZaloRouter.get("/callback", authZaloController.callback);
authZaloRouter.get("/info", validateAccessToken, authZaloController.infoZalo);
authZaloRouter.get("/user", validateAccessToken, authZaloController.userOa);

export { authZaloRouter };
