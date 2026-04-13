import js from "@eslint/js"
import nextPlugin from "@next/eslint-plugin-next"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import reactPlugin from "eslint-plugin-react"

const commonTsRules = {
  "no-undef": "off",
  "no-unused-vars": "off",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],
}

export default [
  {
    ignores: [
      ".next/**",
      "coverage/**",
      "dist/**",
      "eslint.config.mjs",
      "next-env.d.ts",
      "node_modules/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: "readonly",
        document: "readonly",
        fetch: "readonly",
        process: "readonly",
        window: "readonly",
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
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
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...commonTsRules,
    },
  },
  {
    files: ["app/api/**/*.{ts,tsx}", "lib/social/**/*.{ts,tsx}", "scripts/**/*.{ts,tsx}"],
    rules: {
      "no-console": "off",
    },
  },
]
