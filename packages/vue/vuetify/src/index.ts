import { createVuetify as originalCreateVuetify } from "vuetify"
import { defaultOptions } from "./plugins/vuetify"
import "./index.ts"
import "./index.css"

// 커스텀 컴포넌트 가져오기 (필요시)
// import { VBtn } from './components/VBtn'

// createVuetify 함수 재정의
export function createVuetify(options = {}) {
  // 기본 옵션과 사용자 옵션 병합
  // 사용자 옵션으로 기본 옵션 덮어쓰기
  const mergedOptions = { ...defaultOptions, ...options, theme: undefined }

  // 원본 createVuetify 호출
  return originalCreateVuetify(mergedOptions)
}
