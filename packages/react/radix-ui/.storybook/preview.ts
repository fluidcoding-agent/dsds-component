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
          "사용하기",
          "접근성 (Accessibility)",
          ["설치 방법"],
          "개발자 가이드",
          ["개발 시작하기"],
          "Components",
          [
            // Basic Components
            "Buttons",
            "Boxes",
            ["Docs", "Basicbox", "Textbox", "Searchbox"],
            "Checkbox",
            "Radiobox",
            "Toggle",

            // Popover Components
            "Dropdown Menu",
            "Combobox",
            "Modal",

            // Auxiliary Components
            "Tooltip",
          ],
        ],
      },
    },
  },
} satisfies Preview
