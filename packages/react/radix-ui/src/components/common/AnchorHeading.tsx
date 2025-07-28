import type { ComponentPropsWithoutRef, JSX } from "react"

import { toKebabCase } from "@/lib/utils"

interface AnchorHeadingPropsBase<Tag extends keyof JSX.IntrinsicElements = "h1" | "h2" | "h3"> {
  title: string
  className?: string
  hash?: string
  as?: Tag
}

export type AnchorHeadingProps<Tag extends keyof JSX.IntrinsicElements> = AnchorHeadingPropsBase<Tag> &
  Omit<ComponentPropsWithoutRef<Tag>, keyof AnchorHeadingPropsBase<Tag>> & {
    ref?: React.Ref<HTMLHeadingElement>
  }

export const AnchorHeading = <Tag extends keyof JSX.IntrinsicElements = "h2">({
  title,
  hash,
  className,
  children,
  as: TagComponent = "h2" as Tag,
  ...rest
}: AnchorHeadingProps<Tag>) => {
  const anchor = hash || toKebabCase(title)

  return (
    // @ts-expect-error: TypeScript can't infer the correct type here, so we're ignoring the error.
    <TagComponent id={anchor} className={className} {...rest}>
      {children || title}
    </TagComponent>
  )
}
