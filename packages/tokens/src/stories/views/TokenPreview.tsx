import { getCssVariable } from "@docs/helpers/utils"

export const ColorPreview = ({ bg }: { bg: string }) => {
  return (
    <div>
      <div className={`size-sz-144 ${bg}`} />
      <p className="text-body-1">{bg}</p>
      <p className="text-body-2 opacity-dim-1">{getCssVariable("--color-main")}</p>
    </div>
  )
}
