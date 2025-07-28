import type { Preview } from "@storybook/react-vite"

import { basePreviewOptions } from "./settings"

import "@dsds/fonts"
import "../src/index.css"

export default {
  parameters: {
    ...basePreviewOptions,
    options: {
      storySort: {
        order: [
          "시작하기",
          "패키지 설치하기",
          "접근성 (Accessbility)",
          "패키지 사용하기",
          ["설치 방법"],
          "Primitives",
          ["Colors (색상)", "Spacing (간격)", "Typography (서체)", "Border (테두리)", "Shadows (그림자)"],
          "Semantics",
          ["Colors (색상)", "Spacing (간격)", "Typography (서체)", "Border (테두리)", "Shadows (그림자)"],
        ],
      },
    },
  },
} satisfies Preview
