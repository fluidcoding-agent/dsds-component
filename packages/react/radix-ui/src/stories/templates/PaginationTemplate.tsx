import { Pagination, PaginationContent, PaginationDot, PaginationNumber } from "@/components/ui"

export type PaginationTemplateProps = {
  isDot: boolean
  startPage?: number
  selectedPage?: number
  length: number
}

export function PaginationTemplate({ isDot, startPage, selectedPage, length }: PaginationTemplateProps) {
  return (
    <Pagination>
      {isDot ? (
        <PaginationContent isDot={isDot}>
          {Array.from({ length: length }, (_, i) => i + 1).map((p) => (
            <PaginationDot key={p} isSelected={p === selectedPage} />
          ))}
        </PaginationContent>
      ) : (
        <PaginationContent isDot={isDot}>
          <PaginationNumber chevron="first" />
          <PaginationNumber chevron="left" />
          {startPage &&
            Array.from({ length: length }, (_, i) => i + startPage).map((p) => (
              <PaginationNumber key={p} page={p} isSelected={p === selectedPage} />
            ))}
          <PaginationNumber chevron="right" />
          <PaginationNumber chevron="last" />
        </PaginationContent>
      )}
    </Pagination>
  )
}
