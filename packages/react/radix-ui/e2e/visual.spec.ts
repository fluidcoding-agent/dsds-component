// 참고: https://markus.oberlehner.net/blog/running-visual-regression-tests-with-storybook-and-playwright-for-free
import { expect, test } from "@playwright/test"

// This file is created by Storybook when we run `pnpm build:storybook`
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import storybook from "../storybook-static/index.json" with { type: "json" }
import { getLinuxDistro } from "./lib/utils"

// Only run tests on stories, not other documentation pages.
const stories = Object.values(storybook.entries).filter(
  (e) =>
    e.type === "story" &&
    [
      "components-buttons--primary",
      "components-boxes-textbox--default",
      "components-boxes-textbox--ghost",
      "components-boxes-searchbox--default",
      "components-boxes-searchbox--ghost",
      "components-checkbox--default",
      "components-checkbox--checked",
      "components-combobox--default",
      "components-dropdown-menu--layout-test",
      //"components-modal--default",
      "components-toggle--default",
      "components-toggle--checked-small",
      "components-tabs--default",
      "components-badge--badge-notification-new",
      "components-badge--badge-notification-count",
      "components-badge--badge-text",
    ].includes(e.id)
)

for (const story of stories) {
  test(`${story.title} ${story.name} should not have visual regressions`, async ({ page }) => {
    const params = new URLSearchParams({
      id: story.id,
      viewMode: "story",
    })

    await page.goto(`/iframe.html?${params.toString()}`)
    await page.waitForSelector("#storybook-root")
    await page.waitForLoadState("networkidle")
    const distro = getLinuxDistro()

    await expect(page).toHaveScreenshot(`${story.id}-${distro}.png`, {
      fullPage: true,
      animations: "disabled",
      threshold: 0,
    })
  })
}
