import { getVueStorybookConfig as getStorybookConfig } from "../docs/helpers/storybook"

export default getStorybookConfig({
  stories: ["../src/**/*.mdx", "../docs/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  prodUrlPrefix: "/storybooks/vue-vuetify",
})
