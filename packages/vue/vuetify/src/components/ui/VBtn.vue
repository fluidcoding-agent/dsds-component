<template>
  <VBtnPrimitive :color="mappedColor"
                 :size="mappedSize"
                 :variant="mappedVariant"
                 :disabled="disabled"
                 :class="buttonClasses"
                 :data-active="active"
                 :data-selected="selected"
                 v-bind="$attrs">
    <template v-if="!iconOnly && iconOption === 'before' && icon">
      <component :is="icon"
                 class="button-icon" />
    </template>

    <slot v-if="!iconOnly"></slot>

    <template v-if="!iconOnly && iconOption === 'after' && icon">
      <component :is="icon"
                 class="button-icon" />
    </template>

    <template v-if="iconOnly && icon">
      <component :is="icon"
                 class="button-icon" />
    </template>
  </VBtnPrimitive>
</template>

<script setup lang="ts">
import type { Component, VNode } from "vue"
import { computed } from "vue"
import { VBtn as VBtnPrimitive } from "vuetify/components"

export interface VBtnProps {
  variant?: "primary" | "secondary" | "warning" | "danger" | "ghost" | "ghostLink"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  active?: boolean
  selected?: boolean
  icon?: Component | string
  iconOption?: "before" | "after"
}

const props = withDefaults(defineProps<VBtnProps>(), {
  variant: "primary",
  size: "medium",
  disabled: false,
  active: false,
  selected: false,
  iconOption: "before"
})

const slots = defineSlots<{
  default: (props: {}) => VNode[]
}>()

// Calculate iconOnly based on whether there are slot contents
const iconOnly = computed(() => {
  const hasSlotContent = slots.default && slots.default({}).length > 0
  return props.icon && !hasSlotContent
})

// Map DSDS variants to Vuetify colors
const mappedColor = computed(() => {
  const colorMap = {
    primary: "primary",
    secondary: "secondary",
    warning: "warning",
    danger: "error",
    ghost: "surface",
    ghostLink: "surface"
  }
  return colorMap[props.variant] || "primary"
})

// Map DSDS sizes to Vuetify sizes
const mappedSize = computed(() => {
  const sizeMap = {
    small: "small",
    medium: "default",
    large: "large"
  }
  return sizeMap[props.size] || "default"
})

// Map DSDS styles to Vuetify variants
const mappedVariant = computed(() => {
  // Always use flat variant for consistent styling
  return "flat"
})

// Build CSS classes based on React Button.tsx pattern
const buttonClasses = computed(() => {
  const classes = []

  // Base variant classes (matching React Button.tsx)
  switch (props.variant) {
    case "primary":
      classes.push("!bg-button-primary-bg !text-button-primary-text")
      break
    case "secondary":
      classes.push("!bg-button-2nd-bg !text-button-2nd-text !border-button-2nd")
      break
    case "warning":
      classes.push("!bg-button-warning-bg !text-button-warning-text")
      break
    case "danger":
      classes.push("!bg-button-danger-bg !text-button-danger-text")
      break
    case "ghost":
      classes.push("!bg-button-ghost-bg !text-button-ghost-text")
      break
    case "ghostLink":
      classes.push("!bg-button-ghost-link-bg !text-button-ghost-link-text")
      break
  }

  // Size classes
  if (iconOnly.value) {
    const iconOnlyClass = getIconOnlyClass(props.size)
    if (iconOnlyClass) {
      classes.push(iconOnlyClass)
    }
  } else {
    const sizeClass = getSizeClass(props.size)
    if (sizeClass) {
      classes.push(sizeClass)
    }
  }

  // Typography classes
  const typoClass = getTypoClass(props.variant, props.size)
  if (typoClass) {
    classes.push(typoClass)
  }

  // Icon spacing classes
  if (props.icon && props.iconOption && !iconOnly.value) {
    const iconClass = getIconClass(props.size, props.iconOption)
    if (iconClass) {
      classes.push(iconClass)
    }
  }

  // Disabled classes
  if (props.disabled) {
    classes.push(getDisabledClass(props.variant))
  }

  // Hover classes (only if not disabled and not selected)
  if (!props.disabled && !props.selected) {
    classes.push(getHoverClass(props.variant))
  }

  // Focus classes (only if not disabled and not selected)
  if (!props.disabled && !props.selected) {
    classes.push(getFocusClass(props.variant))
  }

  // Active classes
  if (props.active) {
    classes.push(getActiveClass(props.variant))
  }

  // Selected classes
  if (props.selected) {
    classes.push(getSelectedClass(props.variant))
  }

  return classes.join(' ')
})

// Helper functions matching React Button.tsx logic
const getSizeClass = (size: string) => {
  const sizeClassNames = {
    small: "!btn-small !h-5",
    medium: "!btn-medium !h-[24px]",
    large: "!btn-large !h-[28px]",
  }

  return sizeClassNames[size as keyof typeof sizeClassNames] || ""
}

const getIconOnlyClass = (size: string) => {
  const iconOnlyClassNames = {
    small: "btn-icon-small",
    medium: "btn-icon-medium",
    large: "btn-icon-large",
  }

  return iconOnlyClassNames[size as keyof typeof iconOnlyClassNames] || ""
}

const getTypoClass = (variant: string, size: string) => {
  const typoClassNames = {
    secondary: {
      small: "!typo-button-label-small-light",
      medium: "!typo-button-label-medium-light",
      large: "!typo-button-label-medium-light"
    },
    ghost: {
      small: "!typo-button-label-small-light",
      medium: "!typo-button-label-medium",
      large: "!typo-button-label-medium"
    },
    ghostLink: {
      small: "!typo-button-label-small-light",
      medium: "!typo-button-label-medium-light",
      large: "!typo-button-label-medium-light"
    },
    default: {
      small: "!typo-button-label-small",
      medium: "!typo-button-label-medium",
      large: "!typo-button-label-medium"
    }
  }

  const variantClasses = (typoClassNames[variant as keyof typeof typoClassNames] || typoClassNames.default) as Record<string, string>
  return variantClasses[size] || variantClasses.medium
}

const getIconClass = (size: string, iconOption: string) => {
  const iconClassNames = {
    medium: "px-[var(--spacing-button-px-medium-icon-text)]",
    small: {
      after: "pr-[var(--spacing-button-pr-small-icon-after-text)]",
    },
  }

  const sizeClasses = iconClassNames[size as keyof typeof iconClassNames]

  if (!sizeClasses) return null

  if (typeof sizeClasses === "string") return sizeClasses
  return (sizeClasses as Record<string, string>)[iconOption] || null
}

const getDisabledClass = (variant: string) => {
  const disabledClassNames = {
    primary: "bg-button-primary-bg-disabled text-button-primary-text-disabled",
    warning: "bg-button-warning-bg-disabled text-button-warning-text-disabled",
    danger: "bg-button-danger-bg-disabled text-button-danger-text-disabled",
    secondary: "bg-button-2nd-bg-disabled text-button-2nd-text-disabled",
    ghost: "bg-button-ghost-bg-disabled text-button-ghost-text-disabled",
    ghostLink: "bg-button-ghost-link-bg-disabled text-button-ghost-link-text-disabled",
  }

  return disabledClassNames[variant as keyof typeof disabledClassNames] || ""
}

const getHoverClass = (variant: string) => {
  const hoveredClassNames = {
    primary: "hover:!bg-button-primary-bg-hover",
    warning: "hover:!bg-button-warning-bg-hover",
    danger: "hover:!bg-button-danger-bg-hover",
    secondary: "hover:!border-button-2nd-hover",
    ghost: "hover:!bg-button-ghost-bg-hover",
    ghostLink: "hover:!bg-button-ghost-link-bg-hover",
  }

  return hoveredClassNames[variant as keyof typeof hoveredClassNames] || ""
}

const getFocusClass = (variant: string) => {
  const focusedClassNames = {
    primary: "focus-visible:bg-button-primary-bg-hover",
    warning: "focus-visible:bg-button-warning-bg-hover",
    danger: "focus-visible:bg-button-danger-bg-hover",
    secondary: "focus-visible:data-[active=true]:border-button-active-hover focus-visible:data-[active=false]:border-button-2nd-hover",
    ghost: "focus-visible:data-[active=false]:bg-button-ghost-bg-hover",
    ghostLink: "focus-visible:bg-button-ghost-link-bg-hover",
  }

  return focusedClassNames[variant as keyof typeof focusedClassNames] || ""
}

const getActiveClass = (variant: string) => {
  const activeClassNames = {
    primary: "",
    warning: "",
    danger: "",
    secondary: "text-button-2nd-text-selected border-button-active hocus:border-button-active-hover",
    ghost: "text-button-2nd-text-selected border-button-active bg-button-ghost-bg-activated hover:bg-button-ghost-bg-activated hocus:border-button-active-hover",
    ghostLink: "",
  }

  return activeClassNames[variant as keyof typeof activeClassNames] || ""
}

const getSelectedClass = (variant: string) => {
  const selectedClassNames = {
    primary: "bg-button-primary-bg-selected",
    warning: "bg-button-warning-bg-selected",
    danger: "bg-button-danger-bg-selected",
    secondary: "text-button-2nd-text-selected bg-button-2nd-bg-selected border-button-selected!",
    ghost: "bg-button-ghost-bg-selected",
    ghostLink: "bg-button-ghost-link-bg-selected",
  }

  return selectedClassNames[variant as keyof typeof selectedClassNames] || ""
}
</script>

<style scoped>
.button-icon {
  flex-shrink: 0;
}
</style>