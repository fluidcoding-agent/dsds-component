import { BadgeNotificationCount, BadgeNotificationNew, BadgeText } from "@/components/ui"

export function BadgeTemplate({ type, children, color }: { type: string; children?: string; color?: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center gap-1">
        {type == "BadgeNotificationNew" && <BadgeNotificationNew />}
        {type == "BadgeNotificationCount" && <BadgeNotificationCount>{children}</BadgeNotificationCount>}
        {type == "BadgeText" && <BadgeText color={color}>{children}</BadgeText>}
      </div>
    </div>
  )
}
