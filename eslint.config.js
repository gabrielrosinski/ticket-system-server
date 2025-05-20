import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended, 
  ...tseslint.configs.recommended, // Додати стандартні TypeScript правила
  { 
    files: ["**/*.ts"], // Правила для TypeScript файлів
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Вимкнення правила
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  { 
    languageOptions: { 
      globals: globals.node // Додати глобальні змінні Node.js
    }
  },
];
