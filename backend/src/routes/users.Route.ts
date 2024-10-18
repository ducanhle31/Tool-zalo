import { Router } from "express";
import usersController from "../controllers/users.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const userRoutes = Router();

userRoutes.get("/", validateAccessToken, usersController.get);
userRoutes.get("/:id", validateAccessToken, usersController.getDetail);
userRoutes.post("/", validateAccessToken, usersController.create);
userRoutes.put("/:id", validateAccessToken, usersController.update);
userRoutes.delete("/:id", validateAccessToken, usersController.delete);

export { userRoutes };
