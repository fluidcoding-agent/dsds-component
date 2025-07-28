import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  title: string
  icon?: React.ReactNode
  className?: string
}

export function NavBar({ title, icon, className }: Props) {
  return (
    <nav
      className={cn(
        "navbar font-heading relative z-1000 flex h-20 min-w-full flex-nowrap justify-start bg-[#384047] pl-3 text-white xl:justify-center",
        className
      )}
    >
      <div className="mx-auto flex w-[1444px] max-w-[1444px] min-w-[1080px] items-center justify-between max-xl:w-[14444px] xl:min-w-[780px]">
        <div className="logo flex h-20 items-center gap-2 text-[19px]">
          {icon && <div className="mt-[-4px] flex h-20 max-h-20 items-center">{icon}</div>}
          <div>{title}</div>
        </div>
        <div className="menu flex h-20 flex-1 items-center justify-between">
          <ul className="navbar-left mt-[-4px] ml-4 flex items-center gap-1 font-sans text-[14px] font-bold">
            {/* <DropdownMenu>MEMORY</DropdownMenu> */}
            <ChevronDown width="16" height="16" />
          </ul>
          <ul className="navbar-right flex items-center font-sans text-[13px] font-bold">
            <li className="p-2">
              <a href="#">SR문의</a>
            </li>
            <li className="p-2">
              <a href="#">S-VOC</a>
            </li>
            <li className="flex items-center pl-[7px]">
              <div className="border-mp-gray mt-[-2px] ml-[-2px] min-h-[10px] w-[1px] max-w-[1px] min-w-[1px] border-l-1 pr-[2px]"></div>
              <a href="#" className="flex items-center p-2">
                유삼성
                <button type="button" className="ico ico-setting mt-[-2px] ml-[4px]"></button>
              </a>
            </li>
            <li className="ml-[9px] py-2">
              <button className="ico ico-confidential"></button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
