import { TextboxWrapper, type TextboxWrapperProps, type TextboxWrapperVariantProps } from "./_components/TextboxWrapper"

export type TextboxProps = Omit<TextboxWrapperProps, "icon" | "iconSub">
export type TextboxVariantProps = TextboxWrapperVariantProps

export function Textbox(props: TextboxProps) {
  return <TextboxWrapper {...props} wrapperClassName={props.wrapperClassName} data-testid="textbox" />
}
