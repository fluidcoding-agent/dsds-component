import React from "react"
import { getComputedCssVariable } from "@docs/helpers"

const DEFAULT_BORDER_RADIUS_NAMES = ["border-0", "border-sm", "border-md"]

type Props = {
  classNames?: string[]
}

export const BorderWidth: React.FC = ({ classNames = DEFAULT_BORDER_RADIUS_NAMES }: Props) => {
  return (
    <div>
      <div className="gap-lg grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] flex-wrap">
        {classNames.map((className, index) => {
          return (
            <div className="gap-sm flex flex-col" key={index}>
              <div className="gap-sm flex flex-col">
                <div className={`bg-brand-container size-sz-44 border-brand p-xl ${className}`} />
                <div className="flex flex-col">
                  <p className="font-mono font-bold">{className}</p>
                  <p className="typo-caption-mono opacity-dim-1">{getComputedCssVariable("border-width", className)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
