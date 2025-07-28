import React from "react"
import { getComputedCssVariable } from "@docs/helpers"

const DEFAULT_BORDER_RADIUS_NAMES = [
  "rounded-0 rounded-tl-0",
  "rounded-xs rounded-tl-xs",
  "rounded-sm rounded-tl-sm",
  "rounded-md rounded-tl-md",
  "rounded-lg rounded-tl-lg",
  "rounded-xl rounded-tl-xl",
  "rounded-full rounded-tl-full",
]

type Props = {
  classNames?: string[]
}

export const BorderRadius: React.FC = ({ classNames = DEFAULT_BORDER_RADIUS_NAMES }: Props) => {
  return (
    <div>
      <div className="gap-lg grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] flex-wrap">
        {classNames.map((className, index) => {
          const [borderRadius, borderRadiusTopLeft] = className.split(" ")
          return (
            <div className="gap-sm flex flex-col" key={index}>
              <div className={`bg-brand size-sz-44 p-xl ${borderRadiusTopLeft}`} />
              <div className="flex flex-col">
                <p className="font-mono font-bold">{borderRadius}</p>
                <p className="typo-caption-mono opacity-dim-1">
                  {getComputedCssVariable("border-radius", borderRadius)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
