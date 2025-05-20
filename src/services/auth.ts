import { Register, Login, AuthResponse, TokenPair } from "../types/index.js";

import { userRepository } from "../database/repositories/user.js";

import { passwordServices } from "./password.js";
import { tokenServices } from "./token.js";

import { HttpError } from "../errors/HttpError.js";

class AuthService {
  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new HttpError(409, `User with email ${email} already exists`);
    }
  }

  public async register(dto: Register) {
    await this.isEmailExist(dto.email);

    const existingUser = await userRepository.getByUsername(dto.username);

    if (existingUser) {
      throw new HttpError(
        409,
        `User with username ${dto.username} already exists`,
      );
    }

    const password: string = await passwordServices.hashPassword(dto.password);

    const user = await userRepository.create({ ...dto, password });

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
    };
  }

  public async login(
    dto: Login,
  ): Promise<{ user: AuthResponse; token: TokenPair }> {
    const user = await userRepository.getByUsername(dto.username);

    if (!user) {
      throw new HttpError(401, "Invalid username or password");
    }

    const isPasswordCorrect = await passwordServices.comparePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpError(401, "Username or password incorrect");
    }

    const token = tokenServices.generatePair({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}

export const authServices = new AuthService();
