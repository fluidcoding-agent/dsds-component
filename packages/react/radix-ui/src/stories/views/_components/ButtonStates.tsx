import { cn } from "@/lib/utils"
import { Button, type ButtonProps, type ButtonVariantProps } from "@/components/ui/Button"
import { DummyIcon, SpinnerIcon } from "@/components/icons"

import { DemoRow } from "./DemoRow"
import { DemoRowItem } from "./DemoRowItem"

const exampleTypes = ["default", "min", "leftIcon", "rightIcon", "iconOnly", "spinner"] as const
type ExampleType = (typeof exampleTypes)[number]

type ButtonStatesProps = ButtonProps & {
  comment?: string
  rowClassName?: string
  itemClassName?: string
  showStateLabel?: boolean
  showExtraState?: boolean
  statesOnly?: string[]
  examplesOnly?: ExampleType[]
  hideTitle?: boolean
}

export function ButtonStates({
  size = "medium",
  comment,
  className,
  rowClassName,
  itemClassName,
  disabled,
  active,
  selected,
  showStateLabel,
  showExtraState,
  statesOnly,
  examplesOnly,
  variant,
  hideTitle,
}: ButtonStatesProps) {
  const defaultSize = {
    small: "small",
    medium: "medium",
    large: "large",
    smallIcon: "small",
    mediumIcon: "medium",
    largeIcon: "large",
  }[size!] as Exclude<ButtonVariantProps["size"], `${string}Icon`>

  const isLightTheme = variant === "secondary" || variant === "ghost" || variant === "ghostLink"
  const defaultProps = {
    variant,
    active,
    selected,
    disabled,
    className,
  }

  const states = [
    {
      name: "enabled",
      label: "Enabled",
      props: {} as Partial<ButtonProps>,
      showSpinnerButton: true,
    },
    {
      name: "hovered",
      label: "Hover/Pressed",
      props: { className: "hovered" } as Partial<ButtonProps>,
    },
    {
      name: "focused",
      children: "focused",
      label: "Focused",
      props: {
        className: "focused",
      },
    },
    { name: "disabled", children: "disabled", label: "Disabled", props: { disabled: true } as Partial<ButtonProps> },
  ]

  if (showExtraState) {
    states.push({
      name: "activated",
      label: "Activated",
      children: "active",
      props: {
        active: true,
      },
    })
    states.push({ name: "selected", children: "selected", label: "Selected", props: { selected: true } })
  }

  const targetStates = !statesOnly ? states : states.filter((it) => statesOnly.includes(it.name))
  const showExample = Object.values(exampleTypes).reduce(
    (acc, it) => ({ ...acc, [it]: !examplesOnly || examplesOnly.includes(it) }),
    {} as Record<ExampleType, boolean>
  )

  const variantLabels = {
    primary: "button",
    warning: "warning",
    danger: "danger",
    secondary: "2ndary",
    ghost: "ghost",
    ghostLink: "link",
  }

  return (
    <DemoRow size={size?.toString()} comment={comment} hideTitle={hideTitle} className={rowClassName}>
      {targetStates.map((state, index) => {
        const extraProps = {
          ...defaultProps,
          ...state.props,
          children: state?.children || variantLabels[variant!] || "button",
        }
        return (
          <DemoRowItem
            key={index}
            label={showStateLabel ? state.label : undefined}
            className={cn(
              "m-[-4px] flex flex-col gap-2 overflow-clip p-[4px]",
              !itemClassName && "w-[250px]",
              itemClassName
            )}
          >
            <div className={cn("variants flex gap-2", !examplesOnly && "flex-col")}>
              <div className="row flex gap-2">
                {showExample["default"] && <Button {...extraProps} size={defaultSize} />}
                {showExample["min"] && (
                  <Button {...extraProps} size={defaultSize}>
                    min
                  </Button>
                )}
              </div>
              <div className="row flex gap-2">
                {showExample["leftIcon"] && (
                  <Button {...extraProps} size={size} icon={<DummyIcon />} iconOption="before" />
                )}
                {showExample["rightIcon"] && (
                  <Button {...extraProps} size={size} icon={<DummyIcon />} iconOption="after" />
                )}
                {showExample["iconOnly"] && (
                  <Button
                    {...{ ...extraProps, children: null, iconOption: undefined }}
                    size={size}
                    icon={<DummyIcon />}
                  />
                )}
                {showExample["spinner"] && state.showSpinnerButton && (
                  <Button
                    {...{ ...extraProps, children: null, iconOption: undefined }}
                    size={size}
                    icon={
                      <DummyIcon>
                        <SpinnerIcon
                          className="relative"
                          iconClassName={isLightTheme ? "dsds-spinner-brand" : undefined}
                        />
                      </DummyIcon>
                    }
                  />
                )}
              </div>
            </div>
          </DemoRowItem>
        )
      })}
    </DemoRow>
  )
}
