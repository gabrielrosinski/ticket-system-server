import joi from "joi";
import regex from "../constants/regex.js";

class UserValidator {
  private static username = joi.string().min(5).max(30).trim();
  private static displayName = joi.string().min(5).max(50).trim();
  private static email = joi
    .string()
    .max(254)
    .lowercase()
    .pattern(regex.email)
    .trim();
  private static password = joi.string().min(8).max(20).trim();
  private static confirmPassword = joi.string().valid(joi.ref("password"));
  private static role = joi.string().valid("user", "admin");

  public static registerUser = joi.object({
    username: this.username.required(),
    displayName: this.displayName.required(),
    email: this.email.required(),
    password: this.password.required(),
    confirmPassword: this.confirmPassword.required().messages({
      "any.required": "Не вказано підтвердження пароля",
      "any.only": "Паролі не збігаються",
    }),
    role: this.role.required(),
  });

  public static loginUser = joi.object({
    username: this.username.required(),
    password: this.password.required(),
  });

  public static updateUser = joi.object({
    username: this.username,
    displayName: this.displayName,
    email: this.email,
    role: this.role,
  });

  public static adminChangePassword = joi.object({
    password: this.password.required(),
    confirmPassword: this.confirmPassword.required().messages({
      "any.required": "Не вказано підтвердження пароля",
      "any.only": "Паролі не збігаються",
    }),
  });
}

export { UserValidator };
