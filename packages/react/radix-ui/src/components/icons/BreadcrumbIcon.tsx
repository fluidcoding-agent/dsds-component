import { cn } from "@/lib/utils"

export function BreadcrumbSlashIcon({ className }: { className?: string }) {
  return (
    <div className={cn("ml-[-2px] flex h-[14px] w-[12px] items-center justify-center", className)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
        <path d="M6 0H5L0 12H1L6 0Z" fill="var(--colors-neutral-neutral-08)" />
      </svg>
    </div>
  )
}

export function BreadcrumbSelectboxIcon({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-[14px] w-[14px] items-center justify-center", className)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path
          d="M9.00012 0.999969L5.00002 4.99999L1.00012 0.999969"
          stroke="var(--color-icon-default-1st)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  )
}

export function BreadcrumbSelectboxDisabledIcon({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-[14px] w-[14px] items-center justify-center", className)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M9.00012 0.999969L5.00002 4.99999L1.00012 0.999969" stroke="#BBBFC2" strokeWidth="1.2" />
      </svg>
    </div>
  )
}
