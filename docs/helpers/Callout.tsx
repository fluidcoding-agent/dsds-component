import { PropsWithChildren } from "react"
import { cva, cx, VariantProps } from "class-variance-authority"
import { Info as InfoIcon, TriangleAlert as WarningIcon } from "lucide-react"

const styles = cva(["sb-unstyled px-1 py-3 border-l-[4px] default:border-neutral"], {
  variants: {
    marginY: {
      small: "my-1",
      medium: "my-2",
      large: "my-4",
    },
    marginTop: {
      small: "mt-1",
      medium: "mt-2",
      large: "mt-4",
    },
    marginBottom: {
      small: "mb-1",
      medium: "mb-2",
      large: "mb-4",
    },
    kind: {
      success: ["border-success"],
      error: ["border-error"],
      warning: ["border-warning"],
      info: ["border-info"],
    },
  },
  defaultVariants: {
    kind: "info" as const,
  },
})

type ExcludeNull<T> = {
  [P in keyof T]: Exclude<T[P], null>
}

export type StylesProps = ExcludeNull<VariantProps<typeof styles>>

export function Callout({ children, kind = "info", ...variants }: PropsWithChildren<StylesProps>) {
  return (
    <div className={styles({ kind, ...variants })}>
      <div className="flex flex-col items-start gap-2 px-4">
        <div
          className={cx("gap-md text-neutral-1st flex items-center font-bold", {
            ["text-success"]: kind === "success",
            ["text-error"]: kind === "error",
            ["text-warning"]: kind === "warning",
            ["text-info"]: kind === "info",
          })}
        >
          {kind === "info" && (
            <>
              <InfoIcon />
              정보
            </>
          )}
          {kind === "warning" && (
            <>
              <WarningIcon />
              주의
            </>
          )}
        </div>
        <div className="text-neutral-1st">{children}</div>
      </div>
    </div>
  )
}
