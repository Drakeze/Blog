import js from "@eslint/js"
import nextPlugin from "eslint-config-next"
import tsParser from "@typescript-eslint/parser"

const config = [
  js.configs.recommended,
  ...nextPlugin,
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "coverage/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
]

export default config
