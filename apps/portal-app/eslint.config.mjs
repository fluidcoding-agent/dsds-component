import { FlatCompat } from "@eslint/eslintrc";

const cwd = import.meta.dirname;

const compat = new FlatCompat({
  baseDirectory: cwd,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
