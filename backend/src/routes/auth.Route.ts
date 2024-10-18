import { Router } from "express";
import authController from "../controllers/auth.Controller";
import commonController from "../controllers/common.Controller";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.get("/login", commonController.MethodNotAlow);
authRouter.patch("/login", commonController.MethodNotAlow);
authRouter.delete("/login", commonController.MethodNotAlow);
authRouter.put("/login", commonController.MethodNotAlow);

export { authRouter };
