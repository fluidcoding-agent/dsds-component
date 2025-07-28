import React from "react"
import { getComputedCssVariable } from "@docs/helpers"

interface TypoPreviewProps {
  typoNames: string[]
}

export const TypoPreview: React.FC<TypoPreviewProps> = ({ typoNames: fontSizes }) => {
  return (
    <div className="mt-0 flex flex-col justify-start">
      {fontSizes.map((typoName, index) => {
        if (typoName === "---") {
          return <hr className="border-gray-300" key={index} />
        }
        if (typoName.startsWith("#")) {
          if (typoName.startsWith("##")) {
            return <h3 key={index}>{typoName.replace("## ", "")}</h3>
          }
          return (
            <h2 key={index} style={{ marginBlockStart: index === 0 ? "0" : undefined }}>
              {typoName.replace("# ", "")}
            </h2>
          )
        }
        return (
          <div className="mb-xl pl-md" key={index}>
            <p className={`${typoName} mb-sm flex items-center rounded-xs bg-gray-100 p-0`}>
              <span className="uppercase">{typoName}</span> / 안녕하세요?
            </p>
            <p className="font-mono font-bold">{typoName}</p>
            <p className="typo-caption-mono opacity-dim-1">
              font-size: {getComputedCssVariable("font-size", typoName)}, line-height:{" "}
              {getComputedCssVariable("line-height", typoName)}, font-weight:{" "}
              {getComputedCssVariable("font-weight", typoName)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
