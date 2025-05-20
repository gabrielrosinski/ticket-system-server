import { Request, Response, NextFunction } from "express";

import { Login, Register } from "../types/index.js";

import { HttpError } from "../errors/index.js";

import { authServices, tokenServices } from "../services/index.js";

const hours = 24;
const minutes = 60;
const seconds = 60;
const milliseconds = 1000;
const maxAge = hours * minutes * seconds * milliseconds;

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as Register;
      const user = await authServices.register(dto);

      return res.status(201).json({ message: "User created", user });
    } catch (e) {
      next(e);
    }
  }
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as Login;
      const { user, token } = await authServices.login(dto);

      res.cookie("token", token.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax", 
        maxAge: maxAge,
        path: "/",
      });

      return res.status(200).json({ message: "User logged in", user });
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response) {
    const token = req.cookies.token;
    if (!token) {
      throw new HttpError(401, "Token is required");
    }
    try {
      const newToken = tokenServices.refreshToken(token);

      res.cookie("token", newToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: maxAge,
        path: "/",
        partitioned: true,
      });
      return res.json({
        message: "Token refresh successful",
        newToken: newToken,
      });
    } catch {
      throw new HttpError(401, "Token is not valid");
    }
  }

  public logout(_req: Request, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 0,
      path: "/",
      partitioned: true,
    });
    res.json({ message: "Logout successful" });
  }
}

export const authController = new AuthController();
