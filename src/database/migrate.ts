import fs from "fs";
import path from "path";
import db from "./connect.js";
import { fileURLToPath } from "url";
import { passwordServices } from "../services/password.js";

import config from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    if (!config.adminPassword) {
      console.error("Змінна adminPassword не встановлена");
      process.exit(1);
    }

    // Зчитуємо всі файли у папці migrations
    const migrationsDir = path.join(__dirname, "migrations");
    console.log(migrationsDir);
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Виконання міграції: ${file}`);
      await db.query(sql);
    }

    // Init some client data into database
    const clients = path.join(__dirname, "temp", "initTables.sql");
    const sql = fs.readFileSync(clients, "utf8");
    await db.query(sql);

    // Init Admin user
    await db.query(
      `INSERT INTO users (username, display_name, email, password, role) VALUES
      ('admin', 'Адміністратор', 'admin@exapmle.com', $1 , 'admin')`,
      [await passwordServices.hashPassword(config.adminPassword)],
    );

    console.log("Migration completed successfully");
  } catch (err) {
    console.error("Migration execution failed", err);
  } finally {
    db.end();
  }
})();
