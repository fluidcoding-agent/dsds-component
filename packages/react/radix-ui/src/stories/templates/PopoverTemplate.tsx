import { useState } from "react"

import { CloseIcon } from "@/components/icons"
import { Button, Popover, type PopoverContentProps } from "@/components/ui"

export type PopoverTemplateProps = Pick<
  PopoverContentProps,
  "index" | "className" | "title" | "titleClassName" | "childrenClassName" | "isOpen" | "children"
> & {
  trigger: string
}

export function PopoverTemplate({
  index,
  className,
  title,
  titleClassName,
  childrenClassName,
  isOpen,
  children,
  trigger,
}: PopoverTemplateProps) {
  const [show, setShow] = useState(isOpen)
  function display(e: boolean) {
    setShow(e)
  }
  return (
    <div className="flex h-[300px] flex-col overflow-auto">
      <div className="flex h-screen flex-1 items-center justify-center">
        {trigger == "button" && (
          <Button onClick={() => display(!show)} children="Open popover" size="large" variant="secondary" />
        )}
        {trigger == "icon" && <CloseIcon onClick={() => display(!show)} size={20} />}
        {trigger == "text" && <div onClick={() => display(!show)}>Open popover</div>}
        <Popover
          index={index}
          className={className}
          titleClassName={titleClassName}
          childrenClassName={childrenClassName}
          title={title}
          isOpen={show}
          children={children}
          display={(e) => display(e)}
        ></Popover>
      </div>
    </div>
  )
}
