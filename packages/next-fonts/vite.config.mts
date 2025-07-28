import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import { viteStaticCopy } from "vite-plugin-static-copy"

const cwd = import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
    }),
    viteStaticCopy({
      targets: [{ src: "src/index.mjs", dest: "" }],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(cwd, "./src"),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx"],
  },
  build: {
    lib: {
      name: "DsdsNextFonts",
      entry: {
        index: path.resolve(cwd, "src/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "next/font/local"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        preserveModules: true,
        preserveModulesRoot: "src",
        assetFileNames: (assetInfo) => {
          // Return a single string pattern for asset filenames
          if (assetInfo.type === "asset") {
            if (assetInfo.name === "next-fonts.css") {
              return "styles.css"
            }
          }
          return ""
        },
      },
    },
    outDir: "dist",
  },
})
