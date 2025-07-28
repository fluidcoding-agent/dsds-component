import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button, Popover } from "@/components/ui"

import { DemoRowTitle } from "./_components/DemoRowTitle"

export function PopoverDemo() {
  const [show, setShow] = useState([true, true, true, true, true])
  function display(e: boolean, key: number) {
    setShow((prev) => {
      const newShow = [...prev]
      newShow[key] = e
      return newShow
    })
  }
  const variants = [
    { label: "Top & Left", className: "top-[10%] left-[10%]" },
    { label: "Top & Right", className: "top-[10%] left-[50%]" },
    { label: "Bottom & Left", className: "bottom-[10%] left-[10%]" },
    { label: "Bottom & Right", className: "bottom-[10%] left-[50%]" },
    { label: "Center", className: "top-[30%] left-[30%]" },
  ] as { label: string; className: string }[]

  return (
    <div className={cn("flex flex-col gap-10")}>
      {variants.map((state, index: number) => (
        <ul key={index} className="flex flex-col gap-5 pb-10">
          <DemoRowTitle title={state.label} />
          <Button
            onClick={() => display(!show[index], index)}
            children={"Button: " + state.className}
            size="medium"
            variant="primary"
          />
          <Popover
            index={index}
            className={state.className}
            title="Popover"
            children={"Style: " + state.className}
            isOpen={show[index]}
            display={(e, index) => display(e, index)}
          />
        </ul>
      ))}
    </div>
  )
}
