import { Label, Radiobox, RadioboxItem, type RadioboxItemProps, type RadioboxProps } from "@/components/ui"

export type RadioboxTemplateProps = Pick<RadioboxProps, "orientation"> &
  Pick<RadioboxItemProps, "checked" | "disabled"> & {
    itemCount?: number
  }

export function RadioboxTemplate({ orientation = "vertical", itemCount = 1, ...props }: RadioboxTemplateProps) {
  const radioItems = Array.from({ length: itemCount }, (_, i) => `Option ${i + 1}`)
  return (
    <Radiobox orientation={orientation}>
      {radioItems.map((item, i) => (
        <div className="flex items-center gap-2" key={i}>
          <RadioboxItem value={item} {...(itemCount === 1 ? props : {})} id={`option${i}`} />
          <Label htmlFor={`option${i}`}>{item}</Label>
        </div>
      ))}
    </Radiobox>
  )
}
