import fs from "node:fs"
import os from "node:os"
import { expect, type Locator, type Page } from "@playwright/test"

// Storybook의 스토리를 iframe 안에서 단독으로 렌더링하는 URL 형식
export const getStoryUrl = (path: string) => `/iframe.html?path=/story/${path}`

export async function gotoAndGetBox(page: Page, variant: string, size: string, width: number) {
  await page.goto(
    `/iframe.html?path=/story/components-boxes-textbox--default&args=variant:${variant};size:${size};width:${width}`
  )
  const textBox = page.locator('[data-testid="textbox"]')
  const textBoxLayout = textBox.locator(".box-wrapper")
  await expect(textBox).toBeVisible()
  await expect(textBoxLayout).toBeVisible()
  return { textBox, textBoxLayout }
}

export async function getPaddingsTW(element: Locator) {
  const paddings = await element.evaluate((el: Element) => {
    const style = window.getComputedStyle(el)
    return {
      pl: parseInt(style.paddingLeft, 10),
      pr: parseInt(style.paddingRight, 10),
      pt: parseInt(style.paddingTop, 10),
      pb: parseInt(style.paddingBottom, 10),
    }
  })
  const result: Record<string, number> = {}
  if (paddings.pl === paddings.pr) result.px = paddings.pl
  else {
    result.pl = paddings.pl
    result.pr = paddings.pr
  }
  if (paddings.pt === paddings.pb) result.py = paddings.pt
  else {
    result.pt = paddings.pt
    result.pb = paddings.pb
  }
  return result
}

export async function getBoxSizeNum(element: Locator) {
  return element.evaluate((el: Element) => {
    const style = window.getComputedStyle(el)
    return {
      w: parseInt(style.width, 10),
      h: parseInt(style.height, 10),
    }
  })
}

export function getLinuxDistro() {
  // /etc/os-release 파일을 읽어 리눅스 배포판을 추출
  try {
    const osRelease = fs.readFileSync("/etc/os-release", "utf8")
    const match = osRelease.match(/^ID="?([^"\n]*)"?/m)
    const distro = match ? match[1] : os.platform()
    if (distro === "debian") return "docker"
    return distro
  } catch {
    return os.platform()
  }
}
