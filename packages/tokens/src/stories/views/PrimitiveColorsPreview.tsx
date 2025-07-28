import React from "react"
import globalTokens from "@/global.json"

import { toKebabCase } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Helper functions to determine text color based on background luminance
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([0-9a-f\\d]{2})([0-9a-f\\d]{2})([0-9a-f\\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

const srgbToLinear = (c: number): number => {
  // c is a value from 0 to 1 (e.g., component / 255)
  if (c <= 0.04045) {
    return c / 12.92
  } else {
    return Math.pow((c + 0.055) / 1.055, 2.4)
  }
}

const getLuminance = (hexColor: string): number => {
  const rgb = hexToRgb(hexColor)
  if (!rgb) {
    // Default to a dark luminance if hex is invalid, leading to white text
    console.warn(`Invalid hex color: ${hexColor}`)
    return 0
  }

  const r_srgb = rgb.r / 255
  const g_srgb = rgb.g / 255
  const b_srgb = rgb.b / 255

  const r_lin = srgbToLinear(r_srgb)
  const g_lin = srgbToLinear(g_srgb)
  const b_lin = srgbToLinear(b_srgb)

  // Formula for relative luminance (Y)
  return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin
}

interface ColorsDemoProps {
  id?: string
}

const colorGroups = {
  Neutral: globalTokens.Colors.Neutral,
  Oxygen_Red: globalTokens.Colors.Oxygen_Red,
  PhotoResist_Green: globalTokens.Colors.PhotoResist_Green,
  Gate_Purple: globalTokens.Colors.Gate_Purple,
  Wafer_Blue: globalTokens.Colors.Wafer_Blue,
  Dioxide_Film_Blue: globalTokens.Colors.Dioxide_Film_Blue,
  Die_Green: globalTokens.Colors.Die_Green,
  Copper_Yellow: globalTokens.Colors.Copper_Yellow,
  Nitrogen_Green: globalTokens.Colors.Nitrogen_Green,
}

type ColorGropuName = keyof typeof colorGroups
const colorNames = Object.keys(colorGroups) as ColorGropuName[]

export const PrimitiveColorsPreview: React.FC<ColorsDemoProps> = () => {
  return (
    <div className="flex flex-col gap-4">
      {colorNames.map((groupName, groupIndex) => {
        const colors = colorGroups[groupName]
        type ColorName = keyof typeof colors
        const colorNames = Object.keys(colors).sort((a, b) => a.localeCompare(b)) as ColorName[]
        return (
          <div className="flex flex-col" key={groupIndex}>
            <h2 className="flex flex-col" style={{ marginBlockStart: 0 }}>
              {groupName}
            </h2>
            <div className="flex h-20 items-center gap-2">
              {colorNames.map((colorName, index) => {
                const color = colors[colorName as ColorName] as {
                  $type: string
                  $value: string
                  $description?: string
                }
                const luminance = getLuminance(color.$value)
                const textColor = luminance < 0.5 ? "#FFFFFF" : "#000000"
                const dimmedTextColor = luminance < 0.5 ? "#eee" : "#666"
                const shadowColor = luminance > 0.9 ? "rgba(128,128,128,0.5)" : "transparent"
                const varName = "--colors-" + toKebabCase(colorName)

                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        style={{
                          backgroundColor: color.$value,
                          boxShadow: `0px 0 2px ${shadowColor}`,
                        }}
                        className="flex h-full w-20 max-w-20 min-w-20 flex-col items-center justify-center gap-1 rounded-xs px-[2px] py-1"
                      >
                        <span
                          className="h-10 max-w-20 text-xs font-bold text-wrap break-all"
                          style={{ color: textColor }}
                        >
                          {colorName}
                        </span>
                        <pre className="font-mono text-xs" style={{ color: dimmedTextColor }}>
                          {color.$value}
                        </pre>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <pre className="truncate font-mono text-xs" title={varName}>
                        {varName}
                      </pre>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
