import { cn } from "@/lib/utils"

type Props = { size?: number; className?: string; onClick?: React.MouseEventHandler } & React.SVGProps<SVGSVGElement>

export function LnbUnionIcon({ className, onClick }: Props) {
  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M8 0H6V6H0V8H6V14H8V8H14V6H8V0Z" fill="#767D84" />
      </svg>
    </div>
  )
}

export function LnbChevronUpIcon({ className, onClick }: Props) {
  return (
    <div className={cn("stroke-[var(--color-icon-default-1st)]", className)} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 9L7 5L11 9" strokeWidth="1.2" />
      </svg>
    </div>
  )
}

export function LnbTriangleLeftIcon({ className, onClick }: Props) {
  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 5 5" fill="none">
        <path d="M3.5 0H4V5H3.5L0 2.5L3.5 0Z" fill="#565E66" />
      </svg>
    </div>
  )
}

export function LnbTriangleRightIcon({ className, onClick }: Props) {
  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
        <path d="M0 -4.95911e-05H0.5L4 2.50001L0.5 4.99995H0V-4.95911e-05Z" fill="#565E66" />
      </svg>
    </div>
  )
}

export function LnbBulletIcon({ className, onClick }: Props) {
  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 2 2" fill="none">
        <circle cx="1" cy="1" r="1" fill="#90969D" />
      </svg>
    </div>
  )
}

export function LnbMoreIcon({ className, onClick }: Props) {
  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="6" y="2" width="2" height="2" rx="1" fill="#565E66" />
        <rect x="6" y="6" width="2" height="2" rx="1" fill="#565E66" />
        <rect x="6" y="10" width="2" height="2" rx="1" fill="#565E66" />
      </svg>
    </div>
  )
}
