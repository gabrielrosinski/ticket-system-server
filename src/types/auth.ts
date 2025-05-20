import { User } from "./user.js";

interface Login {
  username: User["username"];
  password: User["password"];
}

interface Register extends Login {
  displayName: User["displayName"];
  email: User["email"];
  confirmPassword: User["password"];
  role: User["role"];
}

interface AuthResponse {
  id: User["id"];
  username: User["username"];
  displayName: User["displayName"];
  email: User["email"];
  role: User["role"];
}

export { Register, Login, AuthResponse };
