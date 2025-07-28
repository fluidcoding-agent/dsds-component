import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

import "@testing-library/jest-dom/vitest" // Vitest 전용 import 경로 사용

// 각 테스트 케이스가 끝난 후, 렌더링된 모든 컴포넌트를 정리합니다.
afterEach(() => {
  cleanup()
})
