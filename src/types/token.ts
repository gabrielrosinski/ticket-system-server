import { User } from "./user.js";

interface TokenPayload {
  id: User["id"];
  username: User["username"];
  displayName: User["displayName"];
  role: User["role"];
}

interface TokenPair {
  token: string;
}

export { TokenPayload, TokenPair };
