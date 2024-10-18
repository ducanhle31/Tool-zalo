import { Router } from "express";
import usersController from "../controllers/users.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const userRoutes = Router();

userRoutes.get("/", validateAccessToken, usersController.get);

export { userRoutes };
