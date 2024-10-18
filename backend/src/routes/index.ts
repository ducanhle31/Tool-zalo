import express from "express";
import { authRouter } from "./auth.Route";
import { authZaloRouter } from "./authZalo.Route";
import { bookingsRouter } from "./bookings.Route";
import { campaignsRoutes } from "./campaigns.Route";
import { customerGroupRoutes } from "./customer-groups.Route";
import { customerRoutes } from "./customers.Route";
import { facilitiesRouter } from "./facilities.Route";
import { productCatsRouter } from "./product-categories.Route";
import { productsRouter } from "./products.Route";
import { transactionFormsRouter } from "./transaction-forms.Route";
import { transactionTypesRouter } from "./transaction-types.Route";
import { transactionsRouter } from "./transactions.Route";
import { userRoutes } from "./users.Route";
import { walletsRouter } from "./wallets.Route";
import { zaloTemplatesRoutes } from "./zaloTemplates.Route";

const commonRouter = express.Router();

commonRouter.use("/users", userRoutes);
commonRouter.use("/products", productsRouter);
commonRouter.use("/auth", authRouter);
commonRouter.use("/wallets", walletsRouter);
commonRouter.use("/facilities", facilitiesRouter);
commonRouter.use("/product-categories", productCatsRouter);
commonRouter.use("/transactions", transactionsRouter);
commonRouter.use("/bookings", bookingsRouter);
commonRouter.use("/customers", customerRoutes);
commonRouter.use("/customer-groups", customerGroupRoutes);
commonRouter.use("/authzalo", authZaloRouter);
commonRouter.use("/campaigns", campaignsRoutes);
commonRouter.use("/zalo-templates", zaloTemplatesRoutes);
commonRouter.use("/transaction-forms", transactionFormsRouter);
commonRouter.use("/transaction-types", transactionTypesRouter);

export { commonRouter };
