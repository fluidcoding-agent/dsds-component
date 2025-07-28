"use client"

import { useState } from "react"

import { Searchbox, type SearchboxProps } from "@/components/ui"

export function SearchboxTemplate({ args }: { args: SearchboxProps }) {
  const [text, setText] = useState(args.value)

  const handleClear = () => {
    setText("")
    args.onClear?.()
  }

  return (
    <Searchbox
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
