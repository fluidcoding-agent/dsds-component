import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCssVariable = (varName: string) => getComputedStyle(document.documentElement).getPropertyValue(varName)

export const getComputedCssVariable = (cssAttributeName: string, className: string) => {
  const element = document.createElement("div")
  element.className = className
  element.style.position = "absolute"
  element.style.left = "-9999px"
  element.style.top = "-9999px"
  document.body.appendChild(element)
  const value = getComputedStyle(element).getPropertyValue(cssAttributeName)
  document.body.removeChild(element)

  return value
}

export const oklchToRgb = (oklch: string) => {
  const [l, c, h] = oklch.match(/[\d.]+/g)?.map(Number) || []
  console.log("oklchToRgb", oklch, { l, c, h })
  if (l === undefined || c === undefined || h === undefined) {
    throw new Error("Invalid Oklch format")
  }

  const convert = (l: number, c: number, h: number) => {
    // Conversion logic from Oklch to RGB
    // This is a placeholder; actual conversion logic should be implemented
    return `rgb(${Math.round(l * 255)}, ${Math.round(c * 255)}, ${Math.round(h * 255)})`
  }

  return convert(l, c, h)
}

export const rgbToHex = (rgb: string) => {
  const result = rgb.match(/\d+/g)
  if (!result || result.length < 3) {
    throw new Error("Invalid RGB format")
  }
  const [r, g, b] = result.map(Number)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}
