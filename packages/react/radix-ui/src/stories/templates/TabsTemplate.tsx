import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui"

type Props = React.ComponentProps<typeof Tabs> & {
  tabCount?: number
}

export function TabsTemplate({ tabCount = 5, variant = "default", size = "medium", width = 300 }: Props) {
  const tabItems = Array.from({ length: tabCount }, (_, i) => `Title_${i + 1}`)

  return (
    <Tabs
      variant={variant}
      size={size}
      defaultValue="Title_1"
      width={width}
      className="m-[-4px] p-[4px] outline-1 outline-red-100"
    >
      <TabsList>
        {tabItems.map((title, i) => (
          <TabsTrigger key={i} value={title}>
            <div>{title}</div>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabItems.map((title, i) => (
        <TabsContent key={i} value={title} className="p-1">
          <div>{title}</div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
