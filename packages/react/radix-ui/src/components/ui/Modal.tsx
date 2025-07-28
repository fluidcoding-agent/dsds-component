import * as React from "react"
import * as ModalPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"
import { CloseIconGhost } from "@/components/icons"
import { Checkbox, Label } from "@/components/ui"

function ModalBase({ ...props }: React.ComponentProps<typeof ModalPrimitive.Root>) {
  return <ModalPrimitive.Root data-slot="dialog" {...props} />
}

function ModalTrigger({ ...props }: React.ComponentProps<typeof ModalPrimitive.Trigger>) {
  return <ModalPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function ModalPortal({ ...props }: React.ComponentProps<typeof ModalPrimitive.Portal>) {
  return <ModalPrimitive.Portal data-slot="dialog-portal" {...props} />
}

export function ModalClose({ ...props }: React.ComponentProps<typeof ModalPrimitive.Close>) {
  return <ModalPrimitive.Close data-slot="dialog-close" {...props} />
}

function ModalOverlay({ className, ...props }: React.ComponentProps<typeof ModalPrimitive.Overlay>) {
  return (
    <ModalPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "z-overlay fixed inset-0 bg-[var(--colors-neutral-neutral-17)]/52",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "!duration-100",
        className
      )}
      {...props}
    />
  )
}

function ModalFrame({
  title,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <ModalPortal data-slot="dialog-portal">
      <ModalOverlay />
      <ModalPrimitive.Content
        onInteractOutside={(e) => e.preventDefault()}
        data-slot="dialog-content"
        className={cn(
          // Base
          "bg-background z-modal fixed rounded-[6px] text-[var(--colors-neutral-neutral-17)] shadow-lg duration-100",
          // Spacing
          "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
          // Open Animation
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          // CLose Animation
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "typo-sok-body-14-400",
          "!duration-100",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between px-[20px] pt-[16px]",
            title && "border-b border-[var(--color-border-border-3-inner))] pb-[11px]"
          )}
        >
          <ModalTitle>{title}</ModalTitle>
          <ModalPrimitive.Close data-slot="dialog-close" className="mr-[-4px] flex flex-row justify-end pb-[4px]">
            <button
              className={cn(
                "focus-visible:outline-ring rounded-[2px] p-[2px] hover:bg-[var(--color-bg-on-ghost-button-ghostbtn-hover)] focus:bg-[var(--color-bg-on-ghost-button-ghostbtn-hover)]"
              )}
            >
              <CloseIconGhost />
            </button>
          </ModalPrimitive.Close>
        </div>
        {children}
      </ModalPrimitive.Content>
    </ModalPortal>
  )
}

function ModalContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex min-h-[80px] flex-col px-[20px] text-left", className)}
      {...props}
    />
  )
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn("flex flex-col px-[20px]", className)} {...props} />
}

function ModalTitle({ className, ...props }: React.ComponentProps<typeof ModalPrimitive.Title>) {
  return (
    <ModalPrimitive.Title data-slot="dialog-title" className={cn("typo-modal-title truncate", className)} {...props} />
  )
}

function ModalDescription({ className, ...props }: React.ComponentProps<typeof ModalPrimitive.Description>) {
  return (
    <ModalPrimitive.Description
      data-slot="dialog-description"
      className={cn("max-h-[216px] overflow-y-auto", className)}
      {...props}
    />
  )
}

const ModalWidth = {
  xs: "w-[400px]",
  sm: "w-[520px]",
  md: "w-[640px]",
  lg: "w-[800px]",
  xl: "w-[1000px]",
  "2xl": "w-[1200px]",
}

const ModalDescriptionHeight = {
  xs: "min-h-[115px]",
  sm: "min-h-[191px]",
  md: "min-h-[267px]",
  lg: "min-h-[363px]",
  xl: "min-h-[487px]",
  "2xl": "min-h-[611px]",
}

export type ModalProps = {
  title?: string
  size: keyof typeof ModalWidth
  content: React.ReactNode
  trigger?: React.ReactNode
  defaultOpen?: boolean
  footer?: React.ReactNode
}

export function Modal({ title, size, content, trigger, defaultOpen, footer }: ModalProps) {
  return (
    <ModalBase defaultOpen={defaultOpen}>
      <ModalTrigger>{trigger}</ModalTrigger>
      <ModalFrame title={title} className={cn(ModalWidth[size])}>
        <ModalContent className="min-h-[135px]">
          <ModalDescription className={cn("mt-[12px] mb-[8px]", ModalDescriptionHeight[size])}>
            {content}
          </ModalDescription>
        </ModalContent>
        <ModalFooter className="border-t border-[var(--color-border-border-3-inner)]">{footer}</ModalFooter>
      </ModalFrame>
    </ModalBase>
  )
}

export type MessageModalProps = {
  message?: string
  trigger?: React.ReactNode
  defaultOpen?: boolean
  footer?: React.ReactNode
}

export function MessageModal({ message, trigger, defaultOpen, footer }: MessageModalProps) {
  return (
    <ModalBase defaultOpen={defaultOpen}>
      <ModalTrigger>{trigger}</ModalTrigger>
      <ModalFrame className="max-h-[340px] w-[340px]">
        <ModalContent className="min-h-[96px]">
          <ModalDescription className="my-[8px]">{message}</ModalDescription>
        </ModalContent>
        <ModalFooter>{footer}</ModalFooter>
      </ModalFrame>
    </ModalBase>
  )
}

export function ModalCheckbox({
  id,
  label,
  onCheckedChange,
}: {
  id: string
  label?: string
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center">
      <Checkbox onCheckedChange={onCheckedChange} className="mr-[6px]" id={id} />
      {label && (
        <Label htmlFor={id} className="typo-sok-caption-12-400 mr-[16px] text-[var(--color-text-text-neutral-2nd)]">
          {label}
        </Label>
      )}
    </div>
  )
}
