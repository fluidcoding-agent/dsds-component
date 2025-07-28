import { cn } from "@/lib/utils"

type Props = { size?: number; className?: string; onClick?: React.MouseEventHandler } & React.SVGProps<SVGSVGElement>

export function ToastSuccessIcon({ className, size = 16, onClick }: Props) {
  return (
    <div className={cn("p-[1px]", className)} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#239B2F" />
        <path d="M4 8L6.5 10.5L12 5" stroke="white" strokeWidth="1.8" />
      </svg>{" "}
    </div>
  )
}

export function ToastFailIcon({ className, size = 16, onClick }: Props) {
  return (
    <div className={cn("p-[1px]", className)} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#FF4337" />
        <path d="M11 5L5 11" stroke="white" strokeWidth="1.8" />
        <path d="M5 5L11 11" stroke="white" strokeWidth="1.8" />
      </svg>{" "}
    </div>
  )
}

export function ToastWarningIcon({ className, size = 16, onClick }: Props) {
  return (
    <div className={cn("p-[1px]", className)} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#FFB546" />
        <path
          d="M9.20071 11.2C9.20071 11.8627 8.66346 12.4 8.00071 12.4C7.33797 12.4 6.80071 11.8627 6.80071 11.2C6.80071 10.5373 7.33797 10 8.00071 10C8.66346 10 9.20071 10.5373 9.20071 11.2Z"
          fill="white"
        />
        <path d="M7 4H9V9H7V4Z" fill="white" />
      </svg>{" "}
    </div>
  )
}

export function ToastInformIcon({ className, size = 20, onClick }: Props) {
  return (
    <div className={cn("p-[1px]", className)} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }} viewBox="0 0 20 20" fill="none">
        <path
          d="M2 9.5C2 5.35786 5.35786 2 9.5 2C13.6421 2 17 5.35786 17 9.5C17 13.6421 13.6421 17 9.5 17C5.35786 17 2 13.6421 2 9.5Z"
          fill="#767D84"
          stroke="#767D84"
        />
        <path
          d="M10.6999 6.49999C10.6999 7.16273 10.1627 7.69999 9.49992 7.69999C8.83718 7.69999 8.29992 7.16273 8.29992 6.49999C8.29992 5.83725 8.83718 5.29999 9.49992 5.29999C10.1627 5.29999 10.6999 5.83725 10.6999 6.49999Z"
          fill="white"
        />
        <path d="M8.5 8.5H10.5V13.5H8.5V8.5Z" fill="white" />
      </svg>{" "}
    </div>
  )
}
