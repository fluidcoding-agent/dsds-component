import { getReactStorybookConfig } from "../docs/helpers/storybook"

export default getReactStorybookConfig({
  stories: [
    "../src/**/*.mdx",
    "../docs/contributing/dev-guide/Onboarding.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  prodUrlPrefix: "/storybooks/tokens",
})
