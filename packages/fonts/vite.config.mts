import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"

const cwd = import.meta.dirname

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets",
          dest: "",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      fonts: path.resolve(cwd, "./public/fonts"),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx"],
  },
  build: {
    // 에셋 인라인 한계치를 0으로 설정합니다.
    // 이렇게 하면 모든 폰트, 이미지가 별도 파일로 분리됩니다.
    assetsInlineLimit: 0,
    lib: {
      // 진입점을 CSS가 아닌 TS 파일로 변경합니다.
      entry: {
        index: path.resolve(cwd, "src/index.ts"),
      },
      name: "DsdsFonts", // UMD 빌드 시 사용할 이름
      // JS 번들 포맷을 지정합니다. 빈 배열을 전달하여
      // .mjs, .umd.js 등의 JS 파일 생성을 막습니다.
      formats: [],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".woff") || assetInfo.name?.endsWith(".woff2")) {
            return "fonts/[name][extname]"
          }
          if (assetInfo.type === "asset") {
            if (assetInfo.name === "fonts.css") {
              return "styles.css"
            }
          }
          return ""
        },
      },
    },
  },
}))
