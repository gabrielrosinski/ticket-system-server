import bcrypt from "bcrypt";

class PasswordServices {
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export const passwordServices = new PasswordServices();
