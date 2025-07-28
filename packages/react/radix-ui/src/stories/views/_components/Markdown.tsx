import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

import styles from "./markdown.module.css"

import "./github-markdown.css"

import dedent from "dedent"

type Props = {
  content: string
  className?: string
}

export const MarkdownCode = ({ lang, content, className }: Props & { lang: string }) => (
  <Markdown className={className} content={dedent(`\`\`\`${lang}\n${content}\n\`\`\``)} />
)

export function Markdown({ content, className }: Props) {
  return (
    <div className={cn("markdown-body w-full pt-[7px]", styles.markdown, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        children={content}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return match ? (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <SyntaxHighlighter language={match[1]} className="code min-w-full" {...props} style={materialDark}>
                {children}
              </SyntaxHighlighter>
            ) : (
              <code {...props}>{children}</code>
            )
          },
        }}
      />
    </div>
  )
}
