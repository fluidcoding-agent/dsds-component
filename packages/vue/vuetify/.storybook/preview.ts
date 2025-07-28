import { basePreviewOptions } from "./settings"
import { registerPlugins } from "../src/plugins"
import { setup, type Preview } from "@storybook/vue3-vite"

import "@dsds/fonts"
import "../src/index.css"

setup((app) => {
  registerPlugins(app)
})

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
