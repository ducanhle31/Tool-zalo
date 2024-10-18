import { Router } from "express";
import bookingsController from "../controllers/bookings.Controller";
import { validateAccessToken } from "../middleware/auth.Middleware";

const bookingsRouter = Router();

bookingsRouter.get("/", validateAccessToken, bookingsController.get);
bookingsRouter.get("/:id", validateAccessToken, bookingsController.getDetail);

export { bookingsRouter };
