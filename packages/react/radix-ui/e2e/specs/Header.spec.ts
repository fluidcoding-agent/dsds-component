import { expect, test } from "@playwright/test"

import { getPaddingsTW, getStoryUrl } from "../lib/utils"

test.describe("Header Visual Specs", () => {
  test("Default layout", async ({ page }) => {
    await page.goto(getStoryUrl("components-header--default"))
    const header = page.locator("header")
    expect(await getPaddingsTW(header)).toEqual({ px: 12, py: 0 })
  })
})
