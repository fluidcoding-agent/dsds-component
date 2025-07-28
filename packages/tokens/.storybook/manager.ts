import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"

import { baseTheme } from "./settings"
import { config } from "./theme"

const theme = create({
  ...baseTheme,
  ...config,
})

addons.setConfig({
  theme,
})
