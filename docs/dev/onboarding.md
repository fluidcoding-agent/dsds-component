# DSDS 개발 온보딩 가이드

> 프레임워크별 상세 가이드는 [React 가이드](./react/development-guide.md), [Vue 가이드](./vue/development-guide.md), [트러블슈팅](./react/troubleshooting.md) 문서를 참조하세요.

## 프로젝트 개요

DSDS(Design System for DS)는 브래드 프로스트의 아토믹 디자인 방법론을 기반으로 한 디자인 시스템입니다.

## 아키텍처

### 패키지 구조

- `@dsds/tokens`: 디자인 토큰 (Source of Truth)
- `@dsds/fonts`: 폰트 자원
- `@dsds/react-radix-ui`: React 표준 구현 (Radix UI + TailwindCSS v4)
- `@dsds/vue-vuetify`: Vue 구현 (Vuetify + TailwindCSS v4)

### 디자인 토큰

디자인 토큰은 두 가지 범주로 구성됩니다:

1. **Primitive Tokens**: 원시 토큰 (색상, 서체, 간격, 그림자 등)
2. **Semantic Tokens**: 의미가 부여된 토큰 (버튼, 입력 필드 등)

## 디자인 시스템 핵심 요소

### 색상 시스템

- **원시 색상**: `--colors-neutral-neutral-01` ~ `--colors-neutral-neutral-17`
- **시맨틱 색상**: `--color-button-primary-bg`, `--color-text-brand`

### 타이포그래피

- **폰트 패밀리**: Samsung One Korean NoF (기본), Samsung Sharp Sans (제목)
- **크기 시스템**: 기본 14px, 스케일 팩터 기반

### 간격 시스템

- **기본 간격**: 4px 단위 (`--spacing-1` ~ `--spacing-4`)
- **고정 간격**: `--spacing-2px`, `--spacing-4px`, `--spacing-8px`, `--spacing-16px`

## 공통 개발 표준

### 컴포넌트 API

모든 프레임워크에서 동일한 컴포넌트 API를 제공합니다:

```typescript
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'warning' | 'danger' | 'ghost' | 'ghostLink'
  size?: 'small' | 'medium' | 'large'
  active?: boolean
  selected?: boolean
  disabled?: boolean
}
```

### TailwindCSS v4 활용

모든 패키지는 TailwindCSS v4를 사용하여 일관된 디자인을 제공합니다:

```css
@import "tailwindcss";
@import "tw-animate-css";
```

### 개발 워크플로우

1. **디자인 토큰 정의**: `@dsds/tokens`에서 토큰 정의
2. **표준 구현**: React에서 표준 구현
3. **프레임워크 적용**: 각 프레임워크별 구현
4. **일관성 검증**: Storybook을 통한 시각적 검증

## 프레임워크별 상세 가이드

- **React 개발 가이드**: [docs/dev/react/development-guide.md](./react/development-guide.md)
- **Vue 개발 가이드**: [docs/dev/vue/development-guide.md](./vue/development-guide.md)
- **React 트러블슈팅**: [docs/dev/react/troubleshooting.md](./react/troubleshooting.md)
- **Vue 트러블슈팅**: [docs/dev/vue/troubleshooting.md](./vue/troubleshooting.md)

## 빠른 시작

### 개발 서버 실행

```bash
# React Storybook
cd packages/react/radix-ui && pnpm storybook

# Vue Storybook
cd packages/vue/vuetify && pnpm storybook
```

### 빌드

```bash
# 전체 빌드
pnpm build

# 개별 패키지 빌드
cd packages/{framework}/{package} && pnpm build
```

### 네이밍 규칙

- CSS 변수: `--color-button-primary-bg`
- 컴포넌트: `VBtn`, `Button`
- 스토리: `Primary`, `Secondary`, `Warning`

### 코드 스타일

- TypeScript 사용
- ESLint + Prettier 적용
- Storybook 스토리 작성 필수

### 크기 시스템

- `--text-base`: 0.875rem (14px)
- 기본 폰트 크기: 14px
- 스케일 팩터: `var(--spacing-factor)`

## 간격 시스템

### 기본 간격

- `--spacing-base`: 4px
- `--spacing-1`: 4px
- `--spacing-2`: 8px
- `--spacing-3`: 12px
- `--spacing-4`: 16px

### 고정 간격

- `--spacing-2px`: 2px
- `--spacing-4px`: 4px
- `--spacing-8px`: 8px
- `--spacing-16px`: 16px

## 그림자 시스템

- `--shadow-sm`: 작은 그림자
- `--shadow-md`: 중간 그림자
- `--shadow-lg`: 큰 그림자
- `--shadow-xl`: 매우 큰 그림자

## 개발 워크플로우

1. **디자인 토큰 정의**: `@dsds/tokens`에서 토큰 정의
2. **React 표준 구현**: `@dsds/react-radix-ui`에서 표준 구현
3. **Vue 구현**: `@dsds/vue-vuetify`에서 Vuetify 커스터마이징
4. **일관성 검증**: Storybook을 통한 시각적 검증

## 컨벤션

### 네이밍 규칙

- CSS 변수: `--color-button-primary-bg`
- 컴포넌트: `VBtn`, `Button`
- 스토리: `Primary`, `Secondary`, `Warning`

### 코드 스타일

- TypeScript 사용
- ESLint + Prettier 적용
- Storybook 스토리 작성 필수
