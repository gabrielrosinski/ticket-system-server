import pg from "pg";
import config from "../config/config.js";

const { Pool } = pg;

const pool = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDatabase,
  password: config.pgPassword,
  port: parseInt(config.pgPort || "5432"),
});

export default pool;
