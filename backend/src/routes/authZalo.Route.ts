import { Router } from "express";
import authZaloController from "../controllers/authZalo.Controller";

const authZaloRouter = Router();

authZaloRouter.get("/login", authZaloController.authZalo);
authZaloRouter.get("/callback", authZaloController.callback);

export { authZaloRouter };
