import { Breadcrumb, BreadcrumbElement, BreadcrumbSelect, BreadcrumbText } from "@/components/ui/Breadcrumb"
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/DropdownMenu"

const dropdownMenu = (
  <DropdownMenuContent>
    <DropdownMenuItem>Menu_01-01</DropdownMenuItem>
    <DropdownMenuItem>Menu_01-02</DropdownMenuItem>
    <DropdownMenuItem>Menu_01-03</DropdownMenuItem>
    <DropdownMenuItem>Menu_01-04</DropdownMenuItem>
  </DropdownMenuContent>
)
export function BreadcrumbTemplate({
  isText,
  isLast,
  selected,
  disabled,
  breadcrumbName,
}: {
  isText?: boolean
  isLast?: boolean
  selected?: boolean
  disabled?: boolean
  breadcrumbName: string
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center gap-1">
        <Breadcrumb ellipsis={true}>
          <BreadcrumbElement isLast={isLast}>
            {isText && (
              <BreadcrumbText selected={selected} disabled={disabled}>
                {breadcrumbName}
              </BreadcrumbText>
            )}
            {!isText && (
              <BreadcrumbSelect selected={selected} disabled={disabled} dropdownMenu={dropdownMenu}>
                {breadcrumbName}
              </BreadcrumbSelect>
            )}
          </BreadcrumbElement>
        </Breadcrumb>
      </div>
    </div>
  )
}
