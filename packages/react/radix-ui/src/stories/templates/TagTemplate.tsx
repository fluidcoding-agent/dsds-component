import { Tag, TagProps } from "@/components/ui"

export function TagTemplate({ title, round, icon, hashtag, closeIcon, disabled }: TagProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center gap-1">
        <Tag title={title} round={round} icon={icon} hashtag={hashtag} closeIcon={closeIcon} disabled={disabled} />
      </div>
    </div>
  )
}
