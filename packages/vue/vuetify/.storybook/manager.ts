import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"

import { config } from "./theme"
import { baseTheme } from "./settings"

const theme = create({
  ...baseTheme,
  ...config,
})

addons.setConfig({
  theme,
})
