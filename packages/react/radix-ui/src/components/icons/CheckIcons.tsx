import { cn } from "@/lib/utils"

type Props = { size?: number; className?: string; onClick?: React.MouseEventHandler } & React.SVGProps<SVGSVGElement>

export function CheckedOnIcon({ className, size, onClick, ...props }: Props) {
  size = size || 14
  return (
    <div className={cn("p-[1px]", className)} onClick={onClick}>
      <svg
        {...props}
        fill="none"
        style={{ width: size, height: size, padding: 1, position: "relative", left: 1, top: 0 }}
      >
        <path d="M1 4L3.5 6.5L9 1" strokeWidth="1.8" stroke="#fff" />
      </svg>
    </div>
  )
}
