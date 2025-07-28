import type { Control } from "@storybook/addon-docs/blocks"

export const hideOnControls = { table: { disable: true } }
export const booleanControl = { control: "boolean" } as { control: Control }
export const numberControl = { control: "number" } as { control: Control }
export const radioControl = (options: string[]) =>
  ({
    control: "radio",
    options,
  }) as { control: Control }

export const textControl = (description?: string) =>
  ({
    control: "text",
    description,
  }) as { control: Control; description?: string }

export const rangeControl = (min: number, max: number) =>
  ({
    control: { type: "range", min, max },
  }) as { control: Control }

export const selectControl = (options: string[] | number[] | readonly string[]) =>
  ({
    control: "select",
    options,
  }) as { control: Control }
