import db from "../connect.js";
import { Register, UpdateUser, User } from "../../types/index.js";

class UserRepository {
  public async getAll() {
    return (
      await db.query(`
        SELECT 
          id, 
          username, 
          display_name AS "displayName", 
          email, role, created_at AS "createdAt", 
          updated_at AS "updatedAt" 
        FROM users`)
    ).rows as User[];
  }
  public async getById(id: number) {
    return (
      await db.query(
        `SELECT 
          id, 
          username,
          display_name AS "displayName", 
          email,
          password, 
          role 
         FROM users WHERE id = $1`,
        [id],
      )
    ).rows[0] as User;
  }

  public async getByEmail(email: string) {
    return (
      await db.query(
        `SELECT id, 
          username, 
          display_name AS "displayName",
          email,
          password, 
          role
         FROM users WHERE email = $1`,
        [email],
      )
    ).rows[0] as User;
  }

  public async getByUsername(username: string) {
    return (
      await db.query(
        `SELECT id,
          username,
          display_name AS "displayName",
          email,
          password, 
          role 
          FROM users WHERE username = $1`,
        [username],
      )
    ).rows[0] as User;
  }

  public async create(user: Register) {
    return (
      await db.query(
        `INSERT INTO 
          users (username, display_name, email, password, role)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [user.username, user.displayName, user.email, user.password, user.role],
      )
    ).rows[0] as User;
  }

  public async update(id: number, dto: UpdateUser) {
    return (
      await db.query(
        `UPDATE users 
         SET username = $2, display_name = $3, email = $4, role = $5, updated_at = now() 
         WHERE id = $1 RETURNING *`,
        [id, dto.username, dto.displayName, dto.email, dto.role],
      )
    ).rows[0] as User;
  }

  public async updatePassword(id: number, password: User["password"]) {
    return (
      await db.query(
        `UPDATE users SET password = $2, updated_at = now() WHERE id = $1 RETURNING *`,
        [id, password],
      )
    ).rows[0] as User;
  }

  public async delete(id: User["id"]) {
    return (await db.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]))
      .rows[0] as User;
  }
}

export const userRepository = new UserRepository();
