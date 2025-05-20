import { Request, Response, NextFunction } from "express";

import { HttpError } from "../errors/index.js";
import { userRepository } from "../database/repositories/index.js";

import { UpdateUser } from "../types/index.js";
import { userServices } from "../services/user.js";
import { AdminChangePassword } from "../types/user.js";

class UserController {
  public async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userRepository.getAll();
      return res.json(users);
    } catch {
      throw new HttpError(
        500,
        "Internal Server Error: Failed to all users from database",
      );
    }
  }
  public async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userRepository.getById(Number(req.params.id));

      if (!user) {
        throw new HttpError(404, "User not found");
      }
      return res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);
      const dto = req.body as UpdateUser;
      const user = await userServices.update(userId, dto);
      return res.status(200).json({ message: "User updated", user });
    } catch (e) {
      next(e);
    }
  }

  public async adminChangePassword (
    req: Request,
    res: Response,
    next: NextFunction, 
  ) {
    try {
      const userId = Number(req.params.id);
      const dto = req.body as AdminChangePassword;
      await userServices.adminChangePassword(userId, dto);
      return res
        .status(200)
        .json({ message: "Password changed successfully" });
    } catch (e) {
      next(e);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);

      await userServices.delete(userId);
      return res.status(200).json({ message: "User deleted" });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
