import { cn } from "@/lib/utils"

type Props = { size?: number; className?: string; onClick?: React.MouseEventHandler } & React.SVGProps<SVGSVGElement>

export function MagnifyIcon({ className, size, onClick, ...props }: Props) {
  size = size || 14
  return (
    <div className={cn("p-[1px]", "[&>svg]:stroke-[var(--color-icon-default-1st)]", className)} onClick={onClick}>
      <svg {...props} viewBox="0 0 12 12" fill="none" style={{ width: size, height: size, padding: 1 }}>
        <path d="M8 8L12 12" strokeWidth="1.2" />
        <circle cx="5" cy="5" r="4.4" strokeWidth="1.2" />
      </svg>
    </div>
  )
}
