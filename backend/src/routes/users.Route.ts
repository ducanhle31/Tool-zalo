import { Router } from "express";
import { validateAccessToken } from "../middleware/auth.Middleware";
import usersController from "../controllers/users.controller";

const userRoutes = Router();

userRoutes.get("/", validateAccessToken, usersController.get);
userRoutes.get("/:id", validateAccessToken, usersController.getDetail);
userRoutes.post("/", validateAccessToken, usersController.create);
userRoutes.put("/:id", validateAccessToken, usersController.update);
userRoutes.delete("/:id", validateAccessToken, usersController.delete);

export { userRoutes };
