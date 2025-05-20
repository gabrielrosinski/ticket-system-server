import { Ticket } from "./ticket.js";

type Role = "user" | "admin";

interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  password: string;
  role: Role;
  tickets?: Ticket[];
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateUser {
  username: User["username"];
  displayName: User["displayName"];
  email: User["email"];
  role: User["role"];
}

interface AdminChangePassword {
  password: User["password"];
  confirmPassword: User["password"];
}

interface UserChangePassword extends AdminChangePassword {
  oldPassword: User["password"];
}

export { User, UpdateUser, AdminChangePassword, UserChangePassword };
