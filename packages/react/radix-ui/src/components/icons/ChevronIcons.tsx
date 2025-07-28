import { cn } from "@/lib/utils"

type Props = { size?: number; className?: string; onClick?: React.MouseEventHandler } & React.SVGProps<SVGSVGElement>

export function ChevronDownIcon({ className, size = 14, onClick, ...props }: Props) {
  return (
    <div className={cn("[&>svg]:stroke-[var(--color-icon-default-1st)]", className)} onClick={onClick}>
      <svg {...props} viewBox="0 0 14 14" fill="none" style={{ width: size, height: size, padding: 1 }}>
        <path d="M11.0001 4.99997L7.00002 8.99999L3.00012 4.99997" stroke-width="1.2" />
      </svg>
    </div>
  )
}

export function ChevronLeftIcon({ className, size = 14, onClick, ...props }: Props) {
  return (
    <div className={cn("p-[1px]", "[&>svg]:stroke-[var(--color-icon-default-1st)]", className)} onClick={onClick}>
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" fill="none">
        <path d="M9 3L5 7L9 11" stroke="#565E66" stroke-width="1.2" />
      </svg>
    </div>
  )
}

export function ChevronRightIcon({ className, size = 14, onClick, ...props }: Props) {
  return (
    <div className={cn("p-[1px]", "[&>svg]:stroke-[var(--color-icon-default-1st)]", className)} onClick={onClick}>
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" fill="none">
        <path d="M5 3L9 7L5 11" stroke="#565E66" stroke-width="1.2" />
      </svg>
    </div>
  )
}

export function ChevronsLeftIcon({ className, size = 14, onClick, ...props }: Props) {
  return (
    <div className={cn("p-[1px]", "[&>svg]:stroke-[var(--color-icon-default-1st)]", className)} onClick={onClick}>
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" fill="none">
        <path d="M6 3L2 7L6 11" stroke="#565E66" stroke-width="1.2" />
        <path d="M11 3L7 7L11 11" stroke="#565E66" stroke-width="1.2" />
      </svg>
    </div>
  )
}

export function ChevronsRightIcon({ className, size = 14, onClick, ...props }: Props) {
  return (
    <div className={cn("p-[1px]", "[&>svg]:stroke-[var(--color-icon-default-1st)]", className)} onClick={onClick}>
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" fill="none">
        <path d="M3 3L7 7L3 11" stroke="#565E66" stroke-width="1.2" />
        <path d="M8 3L12 7L8 11" stroke="#565E66" stroke-width="1.2" />
      </svg>{" "}
    </div>
  )
}
