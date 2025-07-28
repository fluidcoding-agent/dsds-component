import { cn } from "@/lib/utils"

import { CloseIcon } from "../icons"

export type TagProps = {
  title: string
  round?: boolean
  icon?: React.ReactNode
  hashtag?: boolean
  closeIcon?: boolean
  disabled?: boolean
} & React.ComponentProps<"a">

function Tag({ title, round, icon, hashtag, closeIcon, disabled }: TagProps) {
  return (
    <div
      className={cn(
        // 형태
        "typo-caption flex h-[20px] min-w-[20px] items-center justify-center rounded-[var(--radius-xs)] px-[4px] hover:cursor-pointer",
        // 색상
        "border-tag hover:border-tag-hover bg-[var(--colors-neutral-neutral-04)] text-[var(--colors-neutral-neutral-15))]",
        // rounded
        round && "rounded-[20px]",
        //disabled
        disabled && "pointer-events-none text-[var(--colors-neutral-neutral-11))]",
        "focus-visible:outline-ring-0",
        hashtag && "h-[18px]"
      )}
    >
      {icon && <div className="pl-[2px]">{icon}</div>}
      {hashtag && <div className="pl-[2px] text-[var(--colors-neutral-neutral-13)]">{hashtag && "#"}</div>}
      <div className="px-[2px] underline-offset-3 hover:underline">{title}</div>
      {closeIcon && (
        <button
          className={cn(
            "focus-visible:outline-ring-0 hover:border-close-hover rounded-[var(--radius-xs))] hover:cursor-pointer hover:bg-[var(--color-bg-on-ghost-button-ghostbtn-hover)] focus:bg-[var(--color-bg-on-ghost-button-ghostbtn-hover)]"
          )}
        >
          <CloseIcon className="p-[-1px]" />
        </button>
      )}
    </div>
  )
}
export { Tag }
