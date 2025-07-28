"use client"

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { usePlatform } from "@/hooks"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import type { TextboxVariantsConfig } from "../../types"
import { Basicbox, type BasicboxProps } from "./Basicbox"

/**
 * Variant 및 Size 설정
 */
const boxVariantsConfig: TextboxVariantsConfig = {
  variant: {
    default: "border-text-box-default",
    ghost: "bg-text-box-bg-ghost",
  },
  size: {
    large: "text-box-large typo-medium py-[4px] pl-[8px] pr-[6px]",
    medium: "text-box-medium typo-medium py-[2px] px-[8px] pr-[6px]",
    small: "text-box-small typo-box-label-small py-[3px] px-[6px] pr-[4px]",
  },
}

const textBoxVariants = cva("rounded-xs", {
  variants: {
    ...boxVariantsConfig,
  },
  defaultVariants: {
    variant: "default",
    size: "medium",
  },
})

// 상태에 따른 클래스 이름 정의
const disabledClassNames = {
  default: "bg-text-box-bg-disabled text-text-box-text-disabled border-text-box-disabled ",
  ghost: "bg-text-box-bg-disabled text-text-box-text-disabled border-text-box-disabled",
}

const hoveredClassNames = {
  default: "hover:not-focus-within:border-text-box-hover",
  ghost: "hover:not-focus-within:bg-text-box-bg-ghost-hover",
}

const focusedClassNames = {
  default: "focus-within:border-text-box-focus",
  ghost: "focus-within:border-text-box-focus focus-within:bg-text-box-bg-default",
}

const populatedClassNames = {
  default: "",
  ghost:
    "bg-text-box-bg-ghost-populated hover:not-focus-within:bg-text-box-bg-ghost-populated-hover border-text-box-ghost-populated",
}

type TextboxWrapperVariantProps = VariantProps<typeof textBoxVariants>

type CommonProps = Omit<React.ComponentPropsWithoutRef<"input" | "textarea">, "type">
type InputProps = React.ComponentPropsWithoutRef<"input">
type TextAreaProps = React.ComponentPropsWithoutRef<"textarea">

export type TextboxWrapperProps = Omit<BasicboxProps, "chidlren"> &
  TextboxWrapperVariantProps & {
    id?: string
    wrapperClassName?: string
    multiline?: boolean
    disabled?: boolean
    width?: number
    value?: string
    defaultValue?: string
    autoResize?: boolean
    iconOnly?: boolean
    readOnly?: boolean
    "data-testid"?: string
    role?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onClick?: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    asButton?: boolean
  }

const TextboxWrapper = forwardRef<HTMLTextAreaElement | HTMLInputElement | HTMLButtonElement, TextboxWrapperProps>(
  (
    {
      id,
      multiline = false,
      disabled = false,
      wrapperClassName: className,
      inputClassName,
      wrapperClassName,
      size = "medium",
      variant = "default",
      placeholder,
      role,
      value,
      width,
      message,
      messageType,
      autoResize = false, // renamed from autoExpand
      icon,
      iconSub,
      iconOnly,
      "data-testid": dataTestId,
      onChange,
      readOnly,
      asButton,
      ...props
    }: TextboxWrapperProps,
    ref
  ) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const inputRefInternal = useRef<HTMLInputElement | HTMLButtonElement>(null)
    const { isWindows } = usePlatform()

    useImperativeHandle(ref, () => {
      if (multiline) {
        return textAreaRef.current as HTMLTextAreaElement
      } else if (asButton) {
        return inputRefInternal.current as HTMLButtonElement
      } else {
        return inputRefInternal.current as HTMLInputElement
      }
    })

    const [isOverflowed, setIsOverflowed] = useState(false)

    const handleChange: React.EventHandler<React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>> = (e) => {
      const _onChange = onChange as
        | React.EventHandler<React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>>
        | undefined
      const el = textAreaRef.current
      if (el) {
        if (autoResize) {
          handleTextAreaHeight()
        } else {
          setIsOverflowed(el.scrollHeight > el.clientHeight)
        }
      }
      _onChange?.(e)
    }

    const disabledClassName = disabled ? disabledClassNames[variant!] : null
    const focusedClassName = !disabled ? focusedClassNames[variant!] : null
    const hoveredClassName = !disabled && variant ? hoveredClassNames[variant] : null
    // `text` 가 비어있지 않은 경우 클래스 이름 추가
    const populatedClassName = value ? populatedClassNames[variant!] : null

    const commonProps: CommonProps = {
      role,
      disabled,
      placeholder,
      value: value,
      readOnly,
      className: cn("text-basic-box-text-value"),
      onChange: handleChange,
      ...props,
    }

    const handleTextAreaHeight = useCallback(() => {
      if (!textAreaRef.current) return

      if (!autoResize) {
        textAreaRef.current.style.height = `${size === "small" ? 42 : 60}px`
        return
      }

      textAreaRef.current.style.height = "min-content"
      if (size === "small") {
        // 브라우저 버그로인한 보정: 14픽셀 높이의 배수가 되어야 하나 픽셀씩 틀어짐 (42 -> 43, 56 -> 57)
        textAreaRef.current.style.height = `${Math.floor(textAreaRef.current.scrollHeight / 14) * 14}px`
      } else {
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
      }
    }, [autoResize, size])

    useEffect(() => {
      if (multiline && !autoResize && textAreaRef.current) {
        const el = textAreaRef.current
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }) // Smooth scroll to the bottom
      }
    }, [autoResize, multiline, value, size])

    useEffect(() => {
      if (autoResize) {
        handleTextAreaHeight()
      } else if (textAreaRef.current) {
        textAreaRef.current.style.height = `${size === "small" ? 42 : 60}px`
      }
      if (multiline && !autoResize && textAreaRef.current) {
        const el = textAreaRef.current
        setIsOverflowed(el.scrollHeight > el.clientHeight)
      } else {
        setIsOverflowed(false)
      }
    }, [value, multiline, autoResize, handleTextAreaHeight, size])

    const textAreaProps: TextAreaProps = {
      ...commonProps,
      className: cn(
        "resize-none overflow-hidden break-words whitespace-pre-wrap",
        autoResize ? "" : "overflow-y-auto truncate",
        commonProps.className
      ),
      style: { scrollbarWidth: "thin" },
      ref: textAreaRef,
      wrap: "soft",
    } as TextAreaProps

    const inputProps: InputProps = {
      ...commonProps,
      type: "text",
      ref: inputRefInternal,
      title: commonProps.value,
    } as InputProps

    return (
      <div className={cn("text-box-wrapper", className)} data-testid={dataTestId} id={id}>
        <Basicbox
          inputClassName={inputClassName}
          wrapperClassName={cn(
            textBoxVariants({ variant, size }),
            disabled && disabledClassName,
            hoveredClassName && hoveredClassName,
            focusedClassName &&
              cn(
                focusedClassName
                // Icon이 없고 Focus 상태일 경우 좌우 패딩을 맞춤 (truncate 가 사라지며 시각적 보정이 어색해짐)
                // !icon && (size === "small" ? "focus-within:pr-[6px]" : "focus-within:pr-[8px]")
              ),
            populatedClassName && populatedClassName,
            iconOnly
              ? // IconOnly 일 경우 padding 조정
                cn(size === "large" && "p-[6px]", size === "medium" && "p-[4px]", size === "small" && "p-[2px]")
              : cn(
                  multiline && "px-[8px] py-[6px]", // Multiline 일 경우 padding 조정
                  // Windows 에서 Multiline 이 적용되고 스크롤바가 보일경우 padding 조정
                  multiline && !autoResize && isOverflowed && isWindows && "pr-[2px]"
                ),
            wrapperClassName
          )}
          icon={icon}
          iconSub={iconSub}
          iconOnly={iconOnly}
          message={message}
          messageType={messageType}
          width={iconOnly ? undefined : width}
        >
          {
            // iconOnly 가 아닐 경우만 input / textarea 컨트롤을 표시합니다.
            !iconOnly && multiline ? (
              <textarea ref={textAreaRef} {...textAreaProps} rows={3} />
            ) : asButton ? (
              <button
                ref={inputRefInternal as React.Ref<HTMLButtonElement>}
                className={cn("text-left", inputClassName)}
              >
                {commonProps.value || commonProps.placeholder}
              </button>
            ) : (
              <input {...inputProps} />
            )
          }
        </Basicbox>
      </div>
    )
  }
)

export { TextboxWrapper }
export type { TextboxWrapperVariantProps }
