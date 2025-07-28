import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import type { ButtonVariantsConfig, IconOptionType } from "./types"

/** Storybook 에서 control select 옵션을 추출하기 쉽도록 분리 */
const buttonVariantsConfig: ButtonVariantsConfig = {
  size: {
    small: "",
    medium: "",
    large: "",
  },
  variant: {
    primary: "bg-button-primary-bg text-button-primary-text",
    secondary: "bg-button-2nd-bg text-button-2nd-text border-button-2nd",
    warning: "bg-button-warning-bg text-button-warning-text",
    danger: "bg-button-danger-bg text-button-danger-text",
    ghost: "bg-button-ghost-bg text-button-ghost-text",
    ghostLink: "bg-button-ghost-link-bg text-button-ghost-link-text",
  },
}

const buttonVariants = cva(
  "border-box inline-flex items-center cursor-pointer justify-center gap-button-default rounded-xs focus-visible:outline-ring",
  {
    variants: {
      ...buttonVariantsConfig,
    },
    defaultVariants: {
      variant: "primary",
      size: "large",
    },
  }
)

/**
 * warning, danger, ghost
 */
const disabledClassNames = {
  primary: "bg-button-primary-bg-disabled text-button-primary-text-disabled",
  warning: "bg-button-warning-bg-disabled text-button-warning-text-disabled",
  danger: "bg-button-danger-bg-disabled text-button-danger-text-disabled",
  secondary: "bg-button-2nd-bg-disabled text-button-2nd-text-disabled",
  ghost: "bg-button-ghost-bg-disabled text-button-ghost-text-disabled",
  ghostLink: "bg-button-ghost-link-bg-disabled text-button-ghost-link-text-disabled",
}

const hoveredClassNames = {
  primary: "hover:bg-button-primary-bg-hover",
  warning: "hover:bg-button-warning-bg-hover",
  danger: "hover:bg-button-danger-bg-hover",
  secondary: "hover:border-button-2nd-hover",
  ghost: "hover:bg-button-ghost-bg-hover",
  ghostLink: "hover:bg-button-ghost-link-bg-hover",
}

const focusedClassNames = {
  primary: "focus-visible:bg-button-primary-bg-hover",
  warning: "focus-visible:bg-button-warning-bg-hover",
  danger: "focus-visible:bg-button-danger-bg-hover",
  secondary:
    "focus-visible:data-[active=true]:border-button-active-hover focus-visible:data-[active=false]:border-button-2nd-hover",
  ghost: "focus-visible:data-[active=false]:bg-button-ghost-bg-hover",
  ghostLink: "focus-visible:bg-button-ghost-link-bg-hover",
}

/** 20250515 현재 디자인에서는 Focus 상태와 동일 */
const activeClassNames = {
  primary: "",
  warning: "",
  danger: "",
  secondary: "text-button-2nd-text-selected border-button-active hocus:border-button-active-hover",
  ghost:
    "text-button-2nd-text-selected border-button-active bg-button-ghost-bg-activated hover:bg-button-ghost-bg-activated hocus:border-button-active-hover",
  ghostLink: "",
}

const selectedClassNames = {
  primary: "bg-button-primary-bg-selected",
  warning: "bg-button-warning-bg-selected",
  danger: "bg-button-danger-bg-selected",
  secondary: "text-button-2nd-text-selected bg-button-2nd-bg-selected border-button-selected!",
  ghost: "bg-button-ghost-bg-selected",
  ghostLink: "bg-button-ghost-link-bg-selected",
}

const iconClassNames = {
  medium: "px-[var(--spacing-button-px-medium-icon-text)]",
  small: {
    after: "pr-[var(--spacing-button-pr-small-icon-after-text)]",
  },
}

const sizeClassNames = {
  small: "btn-small min-h-5",
  medium: "btn-medium",
  large: "btn-large",
}

const iconOnlyClassName = {
  small: "btn-icon-small",
  medium: "btn-icon-medium",
  large: "btn-icon-large",
}

const typoClassNames = {
  secondary: {
    small: "typo-button-label-small-light",
    default: "typo-button-label-medium-light",
  },
  ghost: {
    small: "typo-button-label-small-light",
    default: "typo-button-label-medium",
  },
  ghostLink: {
    small: "typo-button-label-small-light",
    medium: "typo-button-label-medium-light",
    default: "typo-button-label-medium",
  },
  default: {
    small: "typo-button-label-small",
    default: "typo-button-label-medium",
  },
}

/** Icon 과 Text가 동시에 있을때 반영 필요한 추가 클래스 */
const getIconClassNames = (size: string, iconOption: string) => {
  if (!size) return null
  const sizeClassNames = iconClassNames[size as keyof typeof iconClassNames] as Record<string, string>

  if (!sizeClassNames) return null

  if (typeof sizeClassNames === "string") return sizeClassNames
  return sizeClassNames[iconOption] || sizeClassNames.default
}

const getTypoClassNames = (variant: string, size: string) => {
  const variantClassNames = (typoClassNames[variant as keyof typeof typoClassNames] ||
    typoClassNames.default) as Record<string, string>

  return variantClassNames[size] || variantClassNames.default
}

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type ButtonBaseProps = ButtonVariantProps & {
  icon?: React.ReactNode
  selected?: boolean
  active?: boolean
  iconOption?: IconOptionType
  children?: React.ReactNode
}

/**
 *  `size` 가 "*Icon" 으로 주어질 때 `icon` 옵션이 반드시 지정되도록
 *  `ButtonBaseProps` 를 수정합니다.
 */
type ButtonProps = React.ComponentProps<"button"> &
  (
    | (ButtonBaseProps & {
        size?: ButtonVariantProps["size"]
      })
    | (ButtonBaseProps & {
        size: Exclude<ButtonVariantProps["size"], `${string}Icon`>
      })
    | (ButtonBaseProps & {
        size: `${string}Icon`
        icon: NonNullable<ButtonBaseProps["icon"]>
      })
  ) & {
    asChild?: boolean
  }

/**
 * Button 컴포넌트는 다양한 variant, size, icon 옵션을 지원하는 범용 버튼 UI 컴포넌트입니다.
 *
 * - variant: primary, secondary, warning, danger, ghost, ghostLink 등 다양한 스타일을 지원합니다.
 * - size: small, medium, large 크기 옵션을 지원합니다.
 * - icon: 버튼 내부에 아이콘을 삽입할 수 있습니다. `children` 이 없으면 아이콘만 표시됩니다. 이 때 `iconOption` 은 무시됩니다.
 * - iconOption을 통해 위치(before/after) 지정이 가능합니다.
 * - active, selected, disabled 등 상태에 따라 시각적 스타일이 자동 적용됩니다.
 * - children: 버튼의 텍스트 또는 ReactNode를 지정합니다.
 * - 접근성: aria-label 등 button의 표준 속성을 모두 지원합니다.
 *
 * @example
 * // 기본 버튼
 * <Button variant="primary">button</Button>
 *
 * // 아이콘 + 텍스트 (왼쪽)
 * <Button icon={<DummyIcon />} iconOption="before">button</Button>
 *
 * // 아이콘만 (iconOnly)
 * <Button icon={<DummyIcon />} aria-label="icon button" />
 *
 * // 비활성화 버튼
 * <Button disabled>button</Button>
 *
 * // 다양한 variant, size 조합 사용 가능
 * <Button variant="danger" size="large">삭제</Button>
 *
 * @see ButtonProps
 */
function Button({
  className,
  icon,
  selected,
  active,
  size = "medium",
  variant = "primary",
  iconOption = undefined,
  disabled,
  children,
  asChild,
  ...props
}: ButtonProps) {
  const disabledClassName = variant && disabled ? disabledClassNames[variant] : null
  const selectedClassName = selected && variant ? selectedClassNames[variant] : null
  const hoveredClassName = !disabled && !selected && variant ? hoveredClassNames[variant] : null
  const focusedClassName = !disabled && !selected && variant ? focusedClassNames[variant] : null
  const activatedClassName = active && variant ? activeClassNames[variant] : null
  const iconOnly = icon && !children
  const sizeClassName = iconOnly
    ? iconOnlyClassName[size as keyof typeof iconOnlyClassName]
    : sizeClassNames[size as keyof typeof sizeClassNames]

  // children이 문자열이고 aria-label이 명시적으로 제공되지 않은 경우 자동 설정
  const autoAriaLabel = typeof children === "string" && !props["aria-label"] ? children : undefined

  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      title={props.title}
      data-slot="button"
      data-active={active ? "true" : "false"}
      className={cn(
        buttonVariants({ variant, size }),
        getTypoClassNames(variant!, size!),
        sizeClassName,
        iconOption && getIconClassNames(size as string, iconOption),
        hoveredClassName && hoveredClassName,
        focusedClassName && focusedClassName,
        selected && selectedClassName,
        active && cn("active", activatedClassName),
        disabled && cn("cursor-not-allowed", disabledClassName),
        className
      )}
      disabled={disabled}
      {...props}
      aria-label={props["aria-label"] || autoAriaLabel}
    >
      {!iconOnly && iconOption === "before" && icon}
      {iconOnly ? icon : children}
      {!iconOnly && iconOption === "after" && icon}
    </Comp>
  )
}

/**
 * Button 컴포넌트의 props 타입입니다.
 *
 * - variant: 버튼의 스타일 타입 (primary, secondary, warning, danger, ghost, ghostLink 등)
 * - size: 버튼의 크기 (small, medium, larg)
 * - icon: 버튼에 표시할 ReactNode 형태의 아이콘 (`children` 이 없을 때 아이콘만 표시됨)
 * - iconOption: 아이콘의 위치 ("before" | "after" 등, Button 내부에서 위치 결정, children 이 없을 때는 무시됨)
 * - selected: 선택(활성) 상태 표시 여부
 * - active: 활성화(pressed) 상태 표시 여부
 * - disabled: 비활성화 여부
 * - children: 버튼의 텍스트 또는 ReactNode
 * - 기타 button element의 표준 속성(title, aria-label 등) 모두 지원
 *
 * @remarks
 * size가 "*Icon" 형태일 경우 icon prop이 필수입니다.
 *
 * @example
 * <Button variant="primary" size="medium">확인</Button>
 * <Button icon={<DummyIcon />} iconOption="before">아이콘 버튼</Button>
 * <Button size="smallIcon" icon={<DummyIcon />} aria-label="icon only" />
 */
export { Button }
export type { ButtonVariantProps, IconOptionType, ButtonProps }
