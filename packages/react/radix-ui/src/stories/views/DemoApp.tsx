import { ChangeEvent, useState } from "react"
import { Button, Checkbox, Label, Tabs, TabsContent, TabsList, TabsTrigger, Textbox } from "@dsds/react-radix-ui"
import { Source } from "@storybook/addon-docs/blocks"

import DemoAppSource from "./DemoApp?raw"

export function DemoApp() {
  const [text, setText] = useState("")
  const [disabled, setDisabled] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)
  return (
    <div className="demo-app h-full w-full">
      <Tabs defaultValue="app" className="m-[-4px] w-full p-[4px]">
        <TabsList>
          <TabsTrigger value="app">App</TabsTrigger>
          <TabsTrigger value="source">Source</TabsTrigger>
        </TabsList>
        <TabsContent value="app">
          <div className="flex flex-col items-center justify-start gap-4">
            <Button autoFocus variant={disabled ? "secondary" : undefined} onClick={() => setDisabled(!disabled)}>
              {disabled ? "Disabled" : "Enabled"}
            </Button>
            <div className="flex items-center gap-2 leading-[14px]">
              <Label>Check</Label>
              <Checkbox disabled={disabled} />
            </div>
            <Textbox disabled={disabled} value={text} onChange={handleChange} />
            <Textbox
              disabled={disabled}
              message="Text (Optional)"
              messageType="default"
              multiline
              placeholder="textinputplace"
              size="medium"
              value={text}
              onChange={handleChange}
              variant="default"
              width={140}
            />
          </div>
        </TabsContent>
        <TabsContent value="source">
          <Source language="tsx" code={DemoAppSource} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
