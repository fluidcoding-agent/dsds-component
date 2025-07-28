import { Source } from "@storybook/addon-docs/blocks"

import {
  Breadcrumb,
  BreadcrumbElement,
  BreadcrumbSelect,
  BreadcrumbText,
  DropdownMenuContent,
  DropdownMenuItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui"

import { DemoRowTitle } from "./_components/DemoRowTitle"
import DemoAppSource from "./BreadcrumbDemo?raw"

const breadcrumbItemsA = ["Menu_01", "Menu_02", "Menu_03", "Menu_04", "Menu_05"]
const breadcrumbItemsB = [
  "Menu_01",
  "Menu_02",
  "Menu_03",
  "Menu_04",
  "Menu_05",
  "Menu_06",
  "Menu_07",
  "Menu_08",
  "Menu_09_Menu_09",
]
const breadcrumbItemsC = ["Menu_01", "Menu_02", "Menu_01_Menu_01", "Menu_00"]
const dropdownMenu = (
  <DropdownMenuContent>
    <DropdownMenuItem>Sample Menu 1</DropdownMenuItem>
    <DropdownMenuItem>Sample Menu 2</DropdownMenuItem>
    <DropdownMenuItem>Sample Menu 3</DropdownMenuItem>
    <DropdownMenuItem>Sample Menu 4</DropdownMenuItem>
  </DropdownMenuContent>
)

export function BreadcrumbDemo() {
  return (
    <div className="demo-app h-full w-full">
      <Tabs defaultValue="app" className="m-[-4px] w-full p-[4px]">
        <TabsList>
          <TabsTrigger value="app">App</TabsTrigger>
          <TabsTrigger value="source">Source</TabsTrigger>
        </TabsList>
        <TabsContent value="app">
          <div className="flex flex-col gap-4">
            <DemoRowTitle title="3-A. 조합 일반" />
            <Breadcrumb>
              {breadcrumbItemsA.map((item, index) => (
                <BreadcrumbElement key={index}>
                  <BreadcrumbText>{item}</BreadcrumbText>
                </BreadcrumbElement>
              ))}
            </Breadcrumb>

            <DemoRowTitle title="3-B. 조합-예외-뎁스 초과" />
            <Breadcrumb ellipsis>
              {breadcrumbItemsB.map((item, index) => (
                <BreadcrumbElement key={index}>
                  {index >= 7 ? (
                    <BreadcrumbSelect dropdownMenu={dropdownMenu}>{item}</BreadcrumbSelect>
                  ) : (
                    <BreadcrumbText>{item}</BreadcrumbText>
                  )}
                </BreadcrumbElement>
              ))}
            </Breadcrumb>

            <DemoRowTitle title="3-B-(1). 조합-예외-뎁스 초과 표현 제외" />
            <Breadcrumb>
              {breadcrumbItemsB.map((item, index) => (
                <BreadcrumbElement key={index}>
                  {index >= 7 ? (
                    <BreadcrumbSelect dropdownMenu={dropdownMenu}>{item}</BreadcrumbSelect>
                  ) : (
                    <BreadcrumbText>{item}</BreadcrumbText>
                  )}
                </BreadcrumbElement>
              ))}
            </Breadcrumb>

            <DemoRowTitle title="3-C. 조합-예외-메뉴길이 초과" />
            <Breadcrumb>
              {breadcrumbItemsC.map((item, index) => (
                <BreadcrumbElement key={index}>
                  <BreadcrumbText>{item}</BreadcrumbText>
                </BreadcrumbElement>
              ))}
            </Breadcrumb>
          </div>
        </TabsContent>
        <TabsContent value="source">
          <Source language="tsx" code={DemoAppSource} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
