import { expect, test } from "@playwright/test"

import { getBoxSizeNum, getPaddingsTW, gotoAndGetBox } from "../lib/utils"

const cases = [
  { variant: "default", size: "large", width: 120, paddings: { pl: 8, pr: 6, py: 4 }, box: { w: 120, h: 28 } },
  { variant: "default", size: "medium", width: 120, paddings: { pl: 8, pr: 6, py: 2 }, box: { w: 120, h: 24 } },
  { variant: "default", size: "small", width: 108, paddings: { pl: 6, pr: 4, py: 3 }, box: { w: 108, h: 20 } },
  { variant: "ghost", size: "large", width: 120, paddings: { pl: 8, pr: 6, py: 4 }, box: { w: 120, h: 28 } },
  { variant: "ghost", size: "medium", width: 120, paddings: { pl: 8, pr: 6, py: 2 }, box: { w: 120, h: 24 } },
  { variant: "ghost", size: "small", width: 108, paddings: { pl: 6, pr: 4, py: 3 }, box: { w: 108, h: 20 } },
]

test.describe("Textbox Visual Specs", () => {
  for (const { variant, size, width, paddings, box } of cases) {
    test(`Textbox / ${variant} - ${size} padding/layout`, async ({ page }) => {
      const { textBox, textBoxLayout } = await gotoAndGetBox(page, variant, size, width)
      expect(await getPaddingsTW(textBoxLayout)).toEqual(paddings)
      expect(await getBoxSizeNum(textBox)).toEqual(box)
    })
  }
})
