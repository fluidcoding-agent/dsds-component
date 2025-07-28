import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"

const cwd = import.meta.dirname

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "src/index.css",
          dest: "",
        },
        {
          src: "src/styles",
          dest: "",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(cwd, "./src"),
      "@dsds/tokens/utils": path.resolve(cwd, "./src/lib/utils"),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx"],
  },
  build: {
    // 에셋 인라인 한계치를 0으로 설정합니다.
    // 이렇게 하면 모든 폰트, 이미지가 별도 파일로 분리됩니다.
    copyPublicDir: false,
    assetsInlineLimit: 0,
    lib: {
      name: "DsdsTokens",
      entry: {
        index: path.resolve(cwd, "src/index.ts"),
      },
      formats: ["es"],
    },
    preserveModules: true,
    preserveModulesRoot: "src",
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".woff") || assetInfo.name?.endsWith(".woff2")) {
            return "fonts/[name][extname]"
          }
          if (assetInfo.type === "asset") {
            if (assetInfo.name === "tokens.css") {
              return "styles.css"
            }
          }
          return ""
        },
      },
    },
  },
}))
