import React from "react"

type Props = {
  id?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Footer: React.FC = ({ id: _id }: Props) => {
  return (
    <footer className="flex min-h-6 items-center bg-[#edf2f4] px-10 font-sans text-[11px] leading-[12px]">
      <div className="ml-auto flex gap-2 text-[#384047]">
        <div>ⓒ 2025. AI센터 All rights reserved</div>
        <div className="min-w-1 border-r-1 border-gray-300"></div>
        <div>개인정보 처리 방침</div>
        <div className="min-w-1 border-r-1 border-gray-300"></div>
        <div>이용약관</div>
      </div>
    </footer>
  )
}
