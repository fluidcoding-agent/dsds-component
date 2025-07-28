import { useState } from "react"

import {
  Button,
  Toggletip,
  ToggletipContent,
  ToggletipFooter,
  ToggletipFrame,
  ToggletipPage,
  ToggletipPages,
  ToggletipTitle,
  ToggletipTrigger,
  type ToggletipFrameProps,
} from "@/components/ui"

import { DemoRowTitle } from "./_components/DemoRowTitle"

export type ToggletipTemplateProps = Pick<ToggletipFrameProps, "side" | "align" | "title" | "size" | "content"> & {
  trigger: string
}

export function ToggletipDemo() {
  const [currentPage, setCurrentPage] = useState(1)
  const pages = [
    <ToggletipPage>
      <ToggletipTitle>Page 1 Title - Title + Content</ToggletipTitle>
      <ToggletipContent>
        Lorem ipsum dolor sit amet, a consectetur adipisicing elit, sed do eiusmod tempor incididunt u
      </ToggletipContent>
    </ToggletipPage>,
    <ToggletipPage>
      <ToggletipTitle>Page 2 Title - Title + Content Pair</ToggletipTitle>
      <ToggletipContent>
        Lorem ipsum dolor sit amet, a consectetur adipisicing elit, sed do eiusmod tempor incididunt u
      </ToggletipContent>
      <ToggletipTitle>Page 2 Title-1</ToggletipTitle>
      <ToggletipContent>
        Lorem ipsum dolor sit amet, a consectetur adipisicing elit, sed do eiusmod tempor incididunt u
      </ToggletipContent>
    </ToggletipPage>,
    <ToggletipPage>
      <ToggletipContent>
        Lorem ipsum dolor sit amet, a consectetur adipisicing elit, sed do eiusmod tempor incididunt u
      </ToggletipContent>
    </ToggletipPage>,
    <ToggletipPage>
      <ToggletipTitle>Page 4 Title - Title + 2 Contents</ToggletipTitle>
      <ToggletipContent>
        Lorem ipsum dolor sit amet, a consectetur adipisicing elit, sed do eiusmod tempor incididunt u
      </ToggletipContent>
      <ToggletipContent>
        Lorem ipsum dolor sit amet, a consectetur adipisicing elit, sed do eiusmod tempor incididunt u
      </ToggletipContent>
    </ToggletipPage>,
    <ToggletipPage>
      <ToggletipTitle>Page 5 Title</ToggletipTitle>
      <ToggletipContent>
        Lorem ipsum dolor sit amet, a consectetur adipisicing elit, sed do eiusmod tempor incididunt u
      </ToggletipContent>
    </ToggletipPage>,
  ]
  const pagesDefault = [
    <ToggletipPage>
      <ToggletipTitle>Page</ToggletipTitle>
      <ToggletipContent>Page Content</ToggletipContent>
    </ToggletipPage>,
  ]

  const pagesAlign = [
    <ToggletipPage>
      <ToggletipTitle>Alignment Test</ToggletipTitle>
      <ToggletipContent>This is an Alignment Test</ToggletipContent>
    </ToggletipPage>,
  ]

  const prevPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1))
  }
  const nextPage = () => {
    setCurrentPage(Math.min(pages.length, currentPage + 1))
  }
  return (
    <div className="flex flex-col">
      <DemoRowTitle title="Pagination, Page Customization, Footer" />
      <div className="flex h-[350px] flex-col pt-[50px]">
        <div className="flex flex-1 items-center justify-center">
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="Press Button to Turn the Page" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"top"} size={"small"} align={"center"}>
              <ToggletipPages pages={pages} currentPage={currentPage} />
              <ToggletipFooter page={pages.length} currentPage={currentPage}>
                <Button size="medium" variant="secondary" onClick={prevPage}>
                  Prev
                </Button>
                <Button size="medium" variant="secondary" onClick={nextPage}>
                  Next
                </Button>
              </ToggletipFooter>
            </ToggletipFrame>
          </Toggletip>
        </div>
      </div>
      <div className="flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center">
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="Without Footer" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"top"} size={"small"} align={"center"}>
              <ToggletipPages pages={pagesDefault} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
        </div>
      </div>
      <DemoRowTitle title="Alignment" />
      <div className="flex flex-col pt-[150px]">
        <div className="flex flex-1 items-center justify-between">
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="top-start" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"top"} size={"small"} align={"start"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="top-center" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"top"} size={"small"} align={"center"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="top-end" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"top"} size={"small"} align={"end"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
        </div>
      </div>
      <div className="flex flex-col pt-[20px]">
        <div className="flex flex-1 items-center justify-evenly">
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="left-start" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"left"} size={"small"} align={"start"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="right-start" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"right"} size={"small"} align={"start"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
        </div>
        <div className="flex flex-1 items-center justify-evenly pt-[100px]">
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="left-center" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"left"} size={"small"} align={"center"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="right-center" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"right"} size={"small"} align={"center"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
        </div>
        <div className="flex flex-1 items-center justify-evenly pt-[100px]">
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="left-end" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"left"} size={"small"} align={"end"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="right-end" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"right"} size={"small"} align={"end"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
        </div>
        <div className="flex flex-1 items-center justify-between pb-[200px]">
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="bottom-start" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"bottom"} size={"small"} align={"start"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="bottom-center" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"bottom"} size={"small"} align={"center"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
          <Toggletip open>
            <ToggletipTrigger>
              <Button children="bottom-end" size="large" variant="secondary" />
            </ToggletipTrigger>
            <ToggletipFrame side={"bottom"} size={"small"} align={"end"}>
              <ToggletipPages pages={pagesAlign} currentPage={1} />
            </ToggletipFrame>
          </Toggletip>
        </div>
      </div>
    </div>
  )
}
