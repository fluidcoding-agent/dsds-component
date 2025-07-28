import { configDefaults, defineConfig, mergeConfig } from "vitest/config"

import viteConfig from "./vite.config" // 기존 Vite 설정을 가져옵니다.

// mergeConfig를 사용하여 Vite 설정을 확장하고 테스트 전용 설정을 추가합니다.
export default mergeConfig(
  viteConfig, // 기본 Vite 설정을 여기에 전달합니다.
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./src/vitest.setup.ts"],
      exclude: [
        // 기존 Vitest 기본 제외 설정을 유지합니다 (node_modules, dist 등).
        ...configDefaults.exclude,
        // Playwright 테스트가 포함된 'e2e' 폴더 전체를 제외합니다.
        "e2e/**",
      ],
    },
  })
)
