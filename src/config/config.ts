import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  db: process.env.DB,
  jwtSecret: process.env.JWT_SECRET,
  pgUser: process.env.PG_USER,
  pgHost: process.env.PG_HOST,
  pgDatabase: process.env.PG_DATABASE,
  pgPassword: process.env.PG_PASSWORD,
  pgPort: process.env.PG_PORT,
  adminPassword: process.env.ADMIN_PASSWORD,
};

export default config;
