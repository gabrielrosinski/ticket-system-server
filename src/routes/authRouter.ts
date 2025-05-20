import { Router } from "express";

import { commonMiddleware, authMiddleware } from "../middleware/index.js";

import { authController, userController } from "../controllers/index.js";

import { UserValidator } from "../validators/index.js";

const router = Router();

router.get(
  "/users",
  authMiddleware.checkToken,
  authMiddleware.checkAdmin,
  userController.getAllUsers,
);

router.get(
  "/users/:id",
  commonMiddleware.isValidId("id"),
  authMiddleware.checkToken,
  authMiddleware.checkAdmin,
  userController.getUserById,
);
router.post(
  "/register",
  commonMiddleware.bodyValid(UserValidator.registerUser),
  authMiddleware.checkToken,
  authMiddleware.checkAdmin,
  authController.register,
);

router.post(
  "/login",
  commonMiddleware.bodyValid(UserValidator.loginUser),
  authController.login,
);

router.post("/refresh", authMiddleware.checkToken, authController.refresh);

router.post("/logout", authMiddleware.checkToken, authController.logout);

router.patch(
  "/users/:id",
  commonMiddleware.isValidId("id"),
  commonMiddleware.bodyValid(UserValidator.updateUser),
  authMiddleware.checkToken,
  authMiddleware.checkAdmin,
  userController.update,
);

router.patch(
  "/users/:id/admin-change-password",
  commonMiddleware.isValidId("id"),
  commonMiddleware.bodyValid(UserValidator.adminChangePassword),
  authMiddleware.checkToken,
  authMiddleware.checkAdmin,
  userController.adminChangePassword,
);

router.delete(
  "/users/:id",
  commonMiddleware.isValidId("id"),
  authMiddleware.checkToken,
  authMiddleware.checkAdmin,
  userController.delete,
);

export default router;
