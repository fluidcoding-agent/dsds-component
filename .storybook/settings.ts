import { create, ThemeVarsPartial } from "storybook/theming"

export const baseTheme = {
  base: "light",
  fontBase:
    '"Malgun Gothic", "Segoe UI Emoji", "Segoe UI Symbol", "Apple SD Gothic Neo", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Apple Color Emoji", sans-serif',
  fontCode: 'D2Coding, Consolas, "Courier New", ui-monospace, monospace',
} as ThemeVarsPartial

export const basePreviewOptions = {
  docs: {
    theme: create({
      ...baseTheme,
    }),
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  actions: { disable: true },
  interactions: { disable: true },
}
