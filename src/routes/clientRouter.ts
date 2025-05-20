import { Router } from "express";

import { commonMiddleware, authMiddleware } from "../middleware/index.js";

import { clientController } from "../controllers/index.js";

// TODO: add validation for client end points.
// import { ClientValidator } from "../validators/index.js";

const router = Router();

router.get("/", authMiddleware.checkToken, clientController.getAll);

router.get("/partialClientList", authMiddleware.checkToken, clientController.partialClientList);

router.post("/createClient", authMiddleware.checkToken, clientController.createClient);

router.patch("/updateClient", authMiddleware.checkToken, clientController.updateClient);

router.delete("/deleteClient/", authMiddleware.checkToken, clientController.delete);

// Add validator
// router.post("/search", authMiddleware.checkToken, clientController. search);

router.get(
  "/:id",
  commonMiddleware.isValidId("id"),
  authMiddleware.checkToken,
  clientController.getById,
);

export default router;
