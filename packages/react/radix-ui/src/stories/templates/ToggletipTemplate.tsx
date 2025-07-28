import { CloseIconGhost } from "@/components/icons"
import {
  Button,
  Toggletip,
  ToggletipContent,
  ToggletipFooter,
  ToggletipFrame,
  ToggletipPage,
  ToggletipPages,
  ToggletipTitle,
  ToggletipTrigger,
  type ToggletipFrameProps,
} from "@/components/ui"

export type ToggletipTemplateProps = Pick<ToggletipFrameProps, "side" | "align" | "title" | "size" | "content"> & {
  trigger: string
  footer: boolean
}

export function ToggletipTemplate({ trigger, side, size, align, footer, title, content }: ToggletipTemplateProps) {
  const pages = [
    <ToggletipPage>
      <ToggletipTitle>{title}</ToggletipTitle>
      <ToggletipContent>{content}</ToggletipContent>
      <ToggletipTitle>{title}</ToggletipTitle>
      <ToggletipContent>{content}</ToggletipContent>
    </ToggletipPage>,
    <ToggletipPage>
      <ToggletipTitle>{title}</ToggletipTitle>
      <ToggletipContent>{content}</ToggletipContent>
    </ToggletipPage>,
    <ToggletipPage>
      <ToggletipTitle>{title}</ToggletipTitle>
      <ToggletipContent>{content}</ToggletipContent>
    </ToggletipPage>,
    <ToggletipPage>
      <ToggletipTitle>{title}</ToggletipTitle>
      <ToggletipContent>{content}</ToggletipContent>
    </ToggletipPage>,
    <ToggletipPage>
      <ToggletipTitle>{title}</ToggletipTitle>
      <ToggletipContent>{content}</ToggletipContent>
    </ToggletipPage>,
  ]
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-center justify-center">
        <Toggletip defaultOpen>
          <ToggletipTrigger>
            {trigger == "button" && <Button children="Open Toggletip" size="large" variant="secondary" />}
            {trigger == "icon" && <CloseIconGhost />}
            {trigger == "text" && <div>Open Toggletip</div>}
          </ToggletipTrigger>
          <ToggletipFrame side={side} size={size} align={align}>
            <ToggletipPages pages={pages} currentPage={1} />
            {footer && (
              <ToggletipFooter page={pages.length} currentPage={1}>
                <Button size="medium" variant="secondary">
                  min
                </Button>
                <Button size="medium" variant="primary">
                  min
                </Button>
              </ToggletipFooter>
            )}
          </ToggletipFrame>
        </Toggletip>
      </div>
    </div>
  )
}
