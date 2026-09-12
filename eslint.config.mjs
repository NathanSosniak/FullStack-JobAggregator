import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    ignores: ["**/.next/**", "**/node_modules/**", "**/public/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "error",
      "no-console": "warn",
    },
  },
  {
    files: [
      "**/*.test.js",
      "**/*.spec.js",
      "**/*.test.ts",
      "**/*.spec.ts",
      "**/*.test.tsx",
      "**/*.spec.tsx",
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
