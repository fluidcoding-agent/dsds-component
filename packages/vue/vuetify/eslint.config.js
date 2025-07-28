// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook"
import eslintConfigPrettier from "eslint-config-prettier/flat"

import vuetify from 'eslint-config-vuetify'

export default [
  ...vuetify(),
  ...eslintConfigPrettier,
]
