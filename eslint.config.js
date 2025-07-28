import js from "@eslint/js"
import prettierConfig from "eslint-config-prettier" // Prettier와 충돌하는 ESLint 규칙 비활성화
import prettierPlugin from "eslint-plugin-prettier" // Prettier 플러그인
import reactCompiler from "eslint-plugin-react-compiler"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist", "storybook-static", "src/components/_shadcn/"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      // Prettier 설정 (항상 배열의 마지막 부분에 위치시키는 것이 좋음)
      {
        plugins: {
          prettier: prettierPlugin, // 'prettier'라는 이름으로 플러그인 등록
        },
        rules: {
          ...prettierConfig.rules, // eslint-config-prettier의 규칙들을 적용하여 충돌 방지
          "prettier/prettier": [
            // eslint-plugin-prettier의 규칙 활성화
            "error",
            {
              // 여기에 Prettier 옵션을 직접 명시할 수도 있지만,
              // .prettierrc.js 파일을 사용하도록 하는 것이 일반적입니다.
              // 비워두면 .prettierrc.js (또는 .prettierrc.json 등) 파일을 자동으로 찾습니다.
              // 만약 .prettierrc 파일의 옵션을 덮어쓰고 싶다면 여기에 명시:
              // printWidth: 120,
              // singleQuote: true,
            },
          ],
          // 만약 ESLint의 max-len 규칙이 여전히 문제를 일으킨다면 명시적으로 비활성화
          // "max-len": "off", // eslint-config-prettier가 이미 이 작업을 수행해야 함
        },
      },
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react-compiler": reactCompiler,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react-compiler/react-compiler": "error",
    },
  },
  {
    files: ["**/ui/**/*.ts", "**/ui/**/*.tsx", "**/tools/theme-provider.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  // Storybook stories 파일에서 hook 사용 허용
  {
    files: ["src/stories/**/*.stories.tsx"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  }
)
