import { Router } from "express";

import authRouter from "./authRouter.js";
import clientRouter from "./clientRouter.js";
import ticketsRouter from "./ticketsRouter.js";

const router = Router();

router.use("/auth/v1/", authRouter);

router.use("/clients/v1/", clientRouter);

router.use("/tickets/v1/", ticketsRouter);

export { router };
