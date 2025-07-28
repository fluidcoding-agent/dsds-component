<template>
  <VSelectPrimitive :variant="mappedVariant"
                    :disabled="disabled"
                    :class="selectClasses"
                    :style="selectStyles"
                    :data-state="isOpen ? 'open' : 'closed'"
                    :menu-props="{
                      class: getMenuClasses(),
                      contentClass: 'dropdown-content-base',
                      origin: 'auto',
                      transition: 'scale-transition',
                      maxHeight: 300,
                      offset: 4
                    }"
                    :item-title="itemTitle"
                    :item-value="itemValue"
                    :items="items"
                    :model-value="modelValue"
                    :placeholder="placeholder"
                    :clearable="clearable"
                    :multiple="multiple"
                    :chips="chips"
                    v-bind="$attrs"
                    @update:focused="handleFocusUpdate"
                    @update:menu="handleMenuUpdate"
                    @update:model-value="emit('update:modelValue', $event)">
    <template #selection="{ item }">
      <slot name="selection"
            :item="item">
        {{ getItemTitle(item) }}
      </slot>
    </template>

    <template #item="{ item, props }">
      <slot name="item"
            :item="item"
            :props="props">
        <div v-bind="props"
             :class="itemClasses"
             @click="props.onClick">
          {{ getItemTitle(item) }}
        </div>
      </slot>
    </template>

    <template #append-inner>
      <slot name="append-inner">
        <svg :class="chevronClasses"
             width="16"
             height="16"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2"
             stroke-linecap="round"
             stroke-linejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </slot>
    </template>
  </VSelectPrimitive>
</template>

<script setup lang="ts">
import type { VNode } from "vue"
import { computed, ref } from "vue"
import { VSelect as VSelectPrimitive } from "vuetify/components"


export interface VSelectProps {
  variant?: "default" | "ghost"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  items?: any[]
  modelValue?: any
  placeholder?: string
  clearable?: boolean
  multiple?: boolean
  chips?: boolean
  itemTitle?: string
  itemValue?: string
  width?: number
}

const props = withDefaults(defineProps<VSelectProps>(), {
  variant: "default",
  size: "medium",
  disabled: false,
  clearable: false,
  multiple: false,
  chips: false,
  itemTitle: "title",
  itemValue: "value"
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'update:focused': [focused: boolean]
  'update:menu': [open: boolean]
}>()

const slots = defineSlots<{
  selection: (props: { item: any }) => VNode[]
  item: (props: { item: any, props: any }) => VNode[]
  'append-inner': () => VNode[]
}>()

const isOpen = ref(false)
const isFocused = ref(false)

// Map DSDS variants to Vuetify variants
const mappedVariant = computed<
  "outlined" | "filled" | undefined
>(() => {
  const variantMap: Record<string, "outlined" | "filled" | undefined> = {
    default: "outlined",
    ghost: "filled"
  }
  return variantMap[props.variant] || "outlined"
})

// Build CSS classes based on React DropdownMenu pattern
const selectClasses = computed(() => {
  const classes = ["fade-zoom-select"]

  // Base select classes
  classes.push("!dropdown-select-base")

  // Size classes
  const sizeClass = getSizeClass(props.size)
  if (sizeClass) {
    classes.push(sizeClass)
  }

  // Variant classes
  const variantClass = getVariantClass(props.variant)
  if (variantClass) {
    classes.push(variantClass)
  }

  // Populated state for ghost variant (matching React TextboxWrapper)
  if (props.variant === "ghost" && props.modelValue) {
    classes.push("dropdown-select-populated")
  }

  // State classes
  if (props.disabled) {
    classes.push("dropdown-select-disabled")
  }

  if (isFocused.value) {
    classes.push("dropdown-select-focused")
  }

  if (isOpen.value) {
    classes.push("dropdown-select-open")
  }

  return classes.join(' ')
})

const selectStyles = computed(() => {
  const styles: Record<string, string> = {}

  // Apply width if specified
  if (props.width) {
    styles.width = `${props.width}px`
    styles.minWidth = `${props.width}px`
  }

  return styles
})

const itemClasses = computed(() => {
  return [
    /* Base classes matching React DropdownMenuItem */
    "!relative !flex !items-center !select-none",
    "!text-sm hover:bg-blue-100",
    /* Height and padding classes (handled by CSS but keeping for consistency) */
    "!h-[26px] !px-[10px]",
    /* Typography */
    "!typo-medium"
  ].join(' ')
})

const chevronClasses = computed(() => {
  const classes = []

  // Base chevron classes (removed transition and rotation)
  classes.push("!w-4 !h-4")

  // Text color based on disabled state
  if (props.disabled) {
    classes.push("!text-dropdown-trigger-text-disabled")
  } else {
    classes.push("!text-dropdown-trigger-text")
  }

  return classes.join(' ')
})

// Helper functions matching React DropdownMenu pattern
const getItemTitle = (item: any) => {
  if (typeof item === 'object' && item !== null) {
    return item[props.itemTitle] || item.title || String(item)
  }
  return String(item)
}

const getItemValue = (item: any) => {
  if (typeof item === 'object' && item !== null) {
    return item[props.itemValue] || item.value || item
  }
  return item
}

const getSizeClass = (size: string) => {
  const sizeClassNames = {
    small: "!dropdown-select-small",
    medium: "!dropdown-select-medium",
    large: "!dropdown-select-large"
  }

  return sizeClassNames[size as keyof typeof sizeClassNames] || ""
}

const getVariantClass = (variant: string) => {
  const variantClassNames = {
    default: "!dropdown-select-outlined",
    ghost: "!dropdown-select-ghost"
  }

  return variantClassNames[variant as keyof typeof variantClassNames] || ""
}

const getMenuClasses = () => {
  return [
  ].join(' ')
}

// Event handlers
const handleFocusUpdate = (focused: boolean) => {
  isFocused.value = focused
  emit('update:focused', focused)
}

const handleMenuUpdate = (open: boolean) => {
  isOpen.value = open
  emit('update:menu', open)
}
</script>

<style>
.dropdown-content-base {
  transform-origin: 0px 0px !important;
  animation-duration: 0.1s;
  transition-duration: 0.1s;
}

.dropdown-content-base.scale-transition-enter-active,
.dropdown-content-base.scale-transition-leave-active {
  transition: opacity 50ms ease-in, transform 50ms ease-in !important;
  transform-origin: 0px 0px !important;
}

/* Enter 애니메이션: 위쪽(-8px)에서 fade + scale + slide */
.dropdown-content-base.scale-transition-enter-from {
  opacity: 0 !important;
  transform: scale(0.95) translateY(-8px) !important;
}

.dropdown-content-base.scale-transition-enter-to {
  opacity: 1 !important;
  transform: scale(1) translateY(0) !important;
}

/* Leave 애니메이션: fade + scale + slide로 위쪽으로 사라짐 */
.dropdown-content-base.scale-transition-leave-from {
  opacity: 1 !important;
  transform: scale(1) translateY(0) !important;
}

.dropdown-content-base.scale-transition-leave-to {
  opacity: 0 !important;
  transform: scale(0.95) translateY(-8px) !important;
}
</style>