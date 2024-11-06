import globals from "globals";
import pluginJs from "@eslint/js";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist/**"],
  },
  
  {files: ["**/*.js"], 
    languageOptions: {sourceType: "commonjs"},    
    rules: 
    {
      indent: ["error", 4],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "linebreak-style": ["error", "unix"],
    }},
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      indent: ["error", 4],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "linebreak-style": ["error", "unix"],
      "@typescript-eslint/no-unused-vars": "warn",
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    plugins: {
      "@typescript-eslint": pluginTs,
    },
  },
  {
    files: ["src/database/migrations/*.ts"],
    rules: {
      quotes: "off",
    },
  },
  pluginJs.configs.recommended,

];