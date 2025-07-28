"use client"

import { Toaster as Sonner, toast, ToasterProps } from "sonner"

import { cn } from "@/lib/utils"
import { ToastFailIcon, ToastInformIcon, ToastSuccessIcon, ToastWarningIcon } from "@/components/icons"

import { CloseIconGhost } from "../icons"

const Toast = ({ animation = false, ...props }: ToasterProps & { animation?: boolean }) => {
  const animationStyle = animation ? "" : ""
  return (
    <Sonner
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: animationStyle,
        },
      }}
      className="toaster group ![z-index:50] ![max-height:280px] ![width:288px]"
      position="top-right"
      offset={{ top: 112, right: 20 }}
      expand={true}
      gap={12}
      duration={2000}
      visibleToasts={4}
      {...props}
    />
  )
}

export type CustomToastProps = {
  t: number | string
  title: string
  body: string
  link: string
  transitionDuration?: number
  onClose?: () => void
  type: string
  duration?: number
  animation?: boolean
}

const CustomToast = ({ t, title, body, link, type }: CustomToastProps) => {
  return (
    <div className={cn("flex flex-row rounded-[2px] shadow-lg")}>
      <div
        className={cn(
          "w-[4px] rounded-l-[2px]",
          type == "success" && "bg-[var(--colors-nitrogen-green-n-green-10)]",
          type == "fail" && "bg-[var(--colors-oxygen-red-o-red-09)]",
          type == "warning" && "bg-[var(--colors-copper-yellow-cu-yellow-09)]",
          type == "inform" && "bg-[var(--colors-neutral-neutral-11)]"
        )}
      />
      <div
        className={cn(
          "flex max-h-[280px] w-[288px] flex-row gap-[12px] rounded-r-[2px] py-[16px] pr-[16px] pl-[12px] text-[var(--colors-neutral-neutral-17)]",
          type == "success" && "bg-[var(--colors-nitrogen-green-n-green-03)]",
          type == "fail" && "bg-[var(--colors-oxygen-red-o-red-03)]",
          type == "warning" && "bg-[var(--colors-copper-yellow-cu-yellow-04)]",
          type == "inform" && "bg-[var(--colors-wafer-blue-wafer-blue-01)]"
        )}
      >
        <div className="flex h-[20px] w-[20px] items-center justify-center">
          {type == "success" && <ToastSuccessIcon />}
          {type == "fail" && <ToastFailIcon />}
          {type == "warning" && <ToastWarningIcon />}
          {type == "inform" && <ToastInformIcon />}
        </div>
        <div className="flex w-full flex-col">
          {title && <div className="typo-sok-h6-14-700 mb-[4px] h-[20px]">{title}</div>}
          {body && <div className="typo-sok-body-14-400 mb-[4px]">{body}</div>}
          {link && (
            <a
              href={link}
              target="_blank"
              className="typo-sok-body-14-400 w-fit text-[var(--color-text-linked)] underline underline-offset-3"
            >
              Linked Text
            </a>
          )}
        </div>
        <div className="flex h-[20px] w-[20px] items-center justify-center">
          <button
            className={cn(
              "focus:outline-ring rounded-[2px] p-[2px] hover:bg-[var(--color-bg-on-ghost-button-ghostbtn-hover)] focus:bg-[var(--color-bg-on-ghost-button-ghostbtn-hover)]"
            )}
          >
            <CloseIconGhost size={12} onClick={() => toast.dismiss(t)} />
          </button>
        </div>
      </div>
    </div>
  )
}

export { Toast, CustomToast }
