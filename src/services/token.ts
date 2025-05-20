import { TokenPair, TokenPayload } from "../types/token.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { HttpError } from "../errors/HttpError.js";

class TokenServices {
  public generatePair(payload: TokenPayload): TokenPair {
    if (!config.jwtSecret) {
      throw new HttpError(500, "JWT secret is not defined");
    }
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: "24h",
    });

    return { token };
  }

  public checkToken(token: string): TokenPayload {
    try {
      const secret = config.jwtSecret || "";

      return jwt.verify(token, secret) as TokenPayload;
    } catch {
      throw new HttpError(401, "Token is not valid:");
    }
  }

  public refreshToken(token: string) {
    try {
      const payload = this.checkToken(token);

      const userData = {
        id: payload.id,
        username: payload.username,
        displayName: payload.displayName,
        role: payload.role,
      };

      const newToken = this.generatePair(userData);
      return newToken;
    } catch {
      throw new HttpError(401, "Token refresh error: token is not valid");
    }
  }
}

export const tokenServices = new TokenServices();
