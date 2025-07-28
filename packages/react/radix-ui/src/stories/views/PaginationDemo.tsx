import { Pagination, PaginationContent, PaginationDot, PaginationNumber } from "@/components/ui"

import { DemoRowTitle } from "./_components/DemoRowTitle"

export function PaginationDemo() {
  return (
    <div>
      <DemoRowTitle title="Sample-A 1~99" />
      <Pagination>
        <PaginationContent isDot={false}>
          <PaginationNumber chevron="first" href="" />
          <PaginationNumber chevron="left" href="" />
          {Array.from({ length: 10 }, (_, i) => i + 1).map((page) => (
            <PaginationNumber key={page} page={page} href="" isSelected={page === 1} />
          ))}
          <PaginationNumber chevron="right" href="" />
          <PaginationNumber chevron="last" href="" />
        </PaginationContent>
      </Pagination>

      <DemoRowTitle title="Sample-B 100~999" />
      <Pagination>
        <PaginationContent isDot={false}>
          <PaginationNumber chevron="first" href="" />
          <PaginationNumber chevron="left" href="" />
          {Array.from({ length: 10 }, (_, i) => i + 991).map((page) => (
            <PaginationNumber key={page} page={page} href="" isSelected={page === 991} />
          ))}
          <PaginationNumber chevron="right" href="" />
          <PaginationNumber chevron="last" href="" />
        </PaginationContent>
      </Pagination>

      <DemoRowTitle title="Sample-C Dot" />
      <Pagination>
        <PaginationContent isDot={true}>
          <PaginationDot href="" isSelected />
          <PaginationDot href="" />
          <PaginationDot href="" />
          <PaginationDot href="" />
          <PaginationDot href="" />
        </PaginationContent>
      </Pagination>
    </div>
  )
}
