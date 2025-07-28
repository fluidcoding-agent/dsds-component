"use client"

import React, { useEffect, useRef, useState } from "react"

import { cn, toKebabCase } from "@/lib/utils"
import { AnchorHeading } from "@/components/common"
import type { AnchorHeadingProps } from "@/components/common/AnchorHeading"

type Props = {
  title?: string
  hash?: string
  children?: React.ReactNode
  className?: string
} & Omit<AnchorHeadingProps<"h1" | "h2" | "h3">, "title">

export function DemoRowTitle({ hash, children, className, as, ...props }: Props) {
  const title = props.title ? props.title : typeof children === "string" ? children : ""
  const anchor = hash || toKebabCase(title)
  const ref = useRef<HTMLHeadingElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const docPath = window.parent.location.search

  useEffect(() => {
    const hash = window.parent.location.hash.replace("#", "")
    if (hash === anchor && ref.current) {
      ref.current.scrollIntoView({ behavior: "instant" })
    }
  })

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${docPath}#${anchor}`)
  }

  return (
    <AnchorHeading
      id={anchor}
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={cn("font-heading group flex w-full items-center text-xl font-bold", className)}
      as={as}
      title={title}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title}
      <span
        onClick={handleCopyLink}
        className={`absolute left-0 mb-1 ml-0 w-[25px] cursor-pointer text-sm opacity-0 transition-opacity group-hover:opacity-100 ${isHovered ? "visible" : "invisible"}`}
        aria-label="Copy link"
      >
        🔗
      </span>
    </AnchorHeading>
  )
}
