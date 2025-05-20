import { userRepository } from "../database/repositories/index.js";
import { HttpError } from "../errors/index.js";
import { UpdateUser } from "../types/index.js";
import { AdminChangePassword, User } from "../types/user.js";
import { passwordServices } from "./password.js";
import { tokenServices } from "./token.js";
import { Request } from "express";

class UserServices {
  private async isUsernameExist(
    username: string,
    userId: number,
  ): Promise<void> {
    const user = await userRepository.getByUsername(username);

    // Перевірка, чи існує користувач з таким username, окрім поточного
    if (user && user.id !== userId) {
      throw new HttpError(409, `User with username ${username} already exists`);
    }
  }
  public async update(userId: number, dto: UpdateUser) {
    const user = await userRepository.getById(userId);

    await this.isUsernameExist(dto.username, user.id);

    if (!user) {
      throw new HttpError(404, "Update user error: user not found");
    }
    return await userRepository.update(userId, dto);
  }

  public async adminChangePassword(userId: number, dto: AdminChangePassword) {
    const user = await userRepository.getById(userId);

    if (!user) {
      throw new HttpError(404, "Update user error: user not found");
    }

    const encryptedPassword = await passwordServices.hashPassword(dto.password);

    return await userRepository.updatePassword(userId, encryptedPassword);
  }

  public async delete(userId: number) {
    const user = await userRepository.getById(userId);

    if (!user) {
      throw new HttpError(404, "Delete user error: user not found");
    }
    return await userRepository.delete(userId);
  }


  public async getUserFromRequest (req: Request) {
    const token = req.cookies.token;

      if (token === undefined) {
        throw new HttpError(400, "Token is required");
      }

      const payload = tokenServices.checkToken(token);

      return await userRepository.getById(payload.id) as User;
  }
}

export const userServices = new UserServices();
