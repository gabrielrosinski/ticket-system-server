import { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

import { HttpError } from "../errors/index.js";
import { userRepository } from "../database/repositories/user.js";

class CommonMiddleware {
  public bodyValid(schema: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await schema.validateAsync(req.body);
        next();
      } catch (e) {
        const err = e as Error;
        next(new HttpError(422, `Validation error: ${err.message}`));
      }
    };
  }

  public isValidId(paramsName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params[paramsName];
        if (isNaN(Number(id))) {
          throw new HttpError(400, `Incorrect ${paramsName}`);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public isValidUsername(paramsName: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const username = req.params[paramsName];
        const user = await userRepository.getByUsername(username);
        if (!user) {
          throw new HttpError(404, `User with username ${username} not found`);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
