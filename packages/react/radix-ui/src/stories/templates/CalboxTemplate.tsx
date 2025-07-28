import { useState } from "react"

import { Calbox, type CalboxProps } from "@/components/ui"

export function CalboxTemplate({ args }: { args: CalboxProps }) {
  const [text, setText] = useState(args.value)

  const handleClear = () => {
    setText("")
    args.onClear?.()
  }

  return (
    <Calbox
      {...args}
      value={text}
      onChange={(e) => {
        setText(e.target.value)
        args.onChange?.(e)
      }}
      onClear={handleClear}
    />
  )
}
