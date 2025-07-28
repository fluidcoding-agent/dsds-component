<template>
  <a class="sb-unstyled"
     :href="finalHref"
     target="_blank"
     ref="noreferrer">
    <div :class="cn(cardStyles(rest), 'bg-blue-100 px-4 py-2 w-46 min-w-46')">
      <span class="font-bold">
        <slot></slot>
      </span>
      <template v-if="description">
        <hr className="text-gray-400 my-2" />
        <p className="font-regular">{{ description }}</p>
      </template>
    </div>
  </a>
</template>

<script lang="ts">
import { cardStyles } from "../constants"
import { cn } from "../utils"
</script>

<script setup lang="ts">

const props = defineProps<{
  href?: string
  description?: string
}>()

const { href, description, ...rest } = props
const prefixUrl = (import.meta as ImportMeta).env.BASE_URL
const finalHref = href ? `${prefixUrl === "/" ? "" : prefixUrl}${href}` : href

</script>

<style scoped></style>