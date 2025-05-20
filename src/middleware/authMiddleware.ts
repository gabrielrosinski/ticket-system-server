import { Request, Response, NextFunction } from "express";

import { User } from "../types/index.js";

import { tokenServices } from "../services/index.js";
import { userRepository } from "../database/repositories/index.js";
import { HttpError } from "../errors/index.js";

class AuthMiddleware {
  public async checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.token;

      if (token === undefined) {
        throw new HttpError(400, "Token is required");
      }

      const payload = tokenServices.checkToken(token);

      const user = (await userRepository.getById(payload.id)) as User;

      if (user === undefined) {
        throw new HttpError(404, "User not found");
      }

      //TODO: need to remove this and instead check the role if its an admin from the jwt for the checkAdmin
      // req.body.user = {
      //   id: user.id,
      //   username: user.username,
      //   displayName: user.displayName,
      //   email: user.email,
      //   role: user.role,
      // };
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body.user as User;
      if (user.role !== "admin") {
        throw new HttpError(403, "You don't have permission for this action");
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
