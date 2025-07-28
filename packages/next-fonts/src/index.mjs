import localFont from "next/font/local"

const samsungOneKoreanNoF = localFont({
  src: [
    {
      path: "./fonts/SamsungOneKoreanNoF-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SamsungOneKoreanNoF-700.woff2",
      weight: "700",
      style: "bold",
    },
  ],
  display: "swap",
  variable: "--font-sans",
})

const samsungSharpSans = localFont({
  src: [
    {
      path: "./fonts/SamsungSharpSans-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-heading",
})

const d2Coding = localFont({
  src: [
    {
      path: "./fonts/D2Coding.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/D2CodingBold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-mono",
})

export const fontClassName = `${samsungOneKoreanNoF.variable} ${samsungSharpSans.variable} ${d2Coding.variable}`
export default fontClassName