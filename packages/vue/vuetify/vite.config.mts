// vite.config.mts

// Plugins
import Components from "unplugin-vue-components/vite"
import Vue from "@vitejs/plugin-vue"
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import dts from "vite-plugin-dts"
import tailwindcss from "@tailwindcss/vite"
import { resolve } from "node:path"

const cwd = import.meta.dirname

// Utilities
import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    Components({
      dts: "src/components.d.ts",
    }),
    dts({
      // dts 플러그인은 타입 정의(*.d.ts) 파일을 생성합니다.
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
      exclude: ["src/stories/**", "tests/**"],
    }),
    tailwindcss(),
  ],

  // 기존 설정들은 그대로 유지합니다.
  optimizeDeps: {
    exclude: ["vuetify"],
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern-compiler",
      },
      scss: {
        api: "modern-compiler",
      },
    },
  },
  build: {
    // 이 부분을 추가합니다.
    lib: {
      entry: resolve(cwd, "src/index.ts"), // 패키지 진입점
      name: "DsdsVueVuetify", // UMD 빌드 시 사용할 이름
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // 번들링에 포함하지 않을 외부 종속성 설정
      external: ["vue", "vuetify", "vuetify/components"],
      output: {
        // 전역 변수 설정 (UMD 빌드용)
        globals: {
          vue: "Vue",
          vuetify: "Vuetify",
          "vuetify/components": "VuetifyComp",
        },
        assetFileNames: (assetInfo) => {
          // Return a single string pattern for asset filenames
          if (assetInfo.type === "asset") {
            if (assetInfo.name === "vue-vuetify.css") {
              return "index.css"
            }
          }
          return ""
        },
        exports: "named",
      },
    },
  },
})
