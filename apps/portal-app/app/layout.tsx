import type { Metadata } from "next"
import { fontClassName } from "@dsds/next-fonts"

import "./index.css"

export const metadata: Metadata = {
  title: "DSDS Portal",
  description: "Provides DSDS Components and Templates",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={fontClassName}>
      <body>{children}</body>
    </html>
  )
}
