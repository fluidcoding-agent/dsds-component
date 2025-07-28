import { getComputedCssVariable, rgbToHex } from "@docs/helpers"

export const ColorsPreview = () => {
  const bgClassNames = [
    "bg-neutral-1st",
    "bg-neutral-2nd",
    "bg-neutral-3rd",
    "bg-brand",
    "bg-danger",
    "bg-info",
    "bg-success",
  ] as const

  return (
    <div className="gap-lg grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] flex-wrap">
      {Object.values(bgClassNames).map((className, index) => {
        const styles = `${className}`
        return (
          <div className="gap-sm flex flex-col" key={index}>
            <div className={`w-sz-160 h-sz-56 relative rounded-md shadow-sm ${styles}`}></div>
            <div className="flex flex-col">
              <p className="ml-sm font-mono font-bold">{className}</p>
              <p className="opacity-dim-1 ml-sm typo-caption-mono font-mono">
                {rgbToHex(getComputedCssVariable("background-color", className))}
              </p>{" "}
            </div>
          </div>
        )
      })}
    </div>
  )
}
