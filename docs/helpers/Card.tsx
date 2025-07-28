import { type ReactNode } from "react"

import { cardStyles } from "./constants"
import { cn } from "./utils"

interface Props {
  children: ReactNode
  description?: string
  href?: string
  isExternalLink?: boolean
}

export const Card = ({ children, description, href, isExternalLink = false, ...rest }: Props) => {
  const prefixUrl = (import.meta as ImportMeta).env.BASE_URL
  const finalHref = href ? `${prefixUrl === "/" ? "" : prefixUrl}${href}` : href

  const dynamicProps = isExternalLink
    ? {
        target: "_blank",
        rel: "noreferrer",
      }
    : {}

  return (
    <a className="sb-unstyled" href={finalHref} {...dynamicProps}>
      <div className={cn(cardStyles(rest), "w-sz-224 bg-blue-100 px-4 py-2")}>
        <span className="font-bold">{children}</span>
        {description && (
          <>
            <hr className="my-2 text-gray-400" />
            <p className="font-regular">{description}</p>
          </>
        )}
      </div>
    </a>
  )
}
