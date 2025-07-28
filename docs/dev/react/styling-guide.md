# React TailwindCSS 스타일링 가이드

## 개요

이 가이드는 `@dsds/react-radix-ui` 패키지에서 TailwindCSS v4와 디자인 토큰을 활용한 스타일링 모범 사례를 설명합니다.

## 디자인 토큰 구조 (리팩토링됨)

### 색상 토큰 계층 구조

#### Semantic 상태 색상 (기존 가이드 기준)
- `--color-brand`: 브랜드 색상
- `--color-brand-hover`: 브랜드 호버 색상
- `--color-info`: 정보 색상
- `--color-danger`: 위험/오류 색상
- `--color-warning`: 경고 색상
- `--color-success`: 성공 색상

#### 중립 색상 (기존 가이드 기준)
- `--color-neutral-1st`: 주요 텍스트 색상
- `--color-neutral-2nd`: 보조 텍스트 색상
- `--color-neutral-3rd`: 비활성 텍스트 색상

#### Content Hierarchy (콘텐츠 계층) 색상
- `--color-heading`, `--color-text-primary`: 제목과 주요 텍스트 (가장 진한 색상)
- `--color-text-body`: 본문 텍스트 (적당한 진한 색상)
- `--color-text-secondary`, `--color-text-caption`: 보조 텍스트 (캡션, 설명)
- `--color-text-muted`: 비활성화/힌트 텍스트
- `--color-text-disabled`: 비활성화된 텍스트

#### Surface (배경) 색상
- `--color-surface-primary`: 기본 배경 (흰색)
- `--color-surface-secondary`: 보조 배경 (매우 연한 회색, 카드/섹션 구분)
- `--color-surface-tertiary`: 강조 배경 (연한 회색, 호버 상태)

#### Interactive (인터랙티브) 색상
- `--color-hover-bg`: 호버 상태 배경
- `--color-accent`: 액센트 색상 (버튼, 링크)
- `--color-accent-hover`: 액센트 호버 색상
- `--color-accent-light`: 연한 액센트 색상

#### Border (테두리) 색상
- `--color-border-light`: 연한 테두리
- `--color-border-medium`: 중간 테두리

#### Scrollbar (스크롤바) 색상
- `--color-scrollbar`: 스크롤바 기본 색상
- `--color-scrollbar-hover`: 스크롤바 호버 색상

#### Semantic 유틸리티 클래스
```tsx
// 상태별 색상 (기존 가이드 기준)
<button className="bg-brand text-white">브랜드 버튼</button>
<div className="text-danger">위험 텍스트</div>
<div className="bg-success">성공 배경</div>
<span className="text-warning">경고 텍스트</span>

// 중립 색상 (기존 가이드 기준)
<p className="text-neutral-1st">주요 텍스트</p>
<span className="text-neutral-2nd">보조 텍스트</span>
<small className="text-neutral-3rd">비활성 텍스트</small>

// 콘텐츠 계층 색상
<h1 className="text-heading">제목</h1>
<p className="text-body">본문 텍스트</p>
<span className="text-secondary">보조 텍스트</span>
<small className="text-caption">캡션</small>
<span className="text-muted">흐린 텍스트</span>

// 배경 색상
<div className="bg-surface-primary">기본 배경</div>
<div className="bg-surface-secondary">보조 배경</div>
<div className="hover:bg-hover-bg">호버 배경</div>

// 액센트 색상
<button className="text-accent hover:text-accent-hover">버튼</button>
<div className="bg-accent-light">연한 액센트 배경</div>
<input className="accent-accent" type="checkbox" />

// 테두리
<div className="border-light">연한 테두리</div>
<div className="border-medium">중간 테두리</div>

// 스크롤바
<div className="bg-scrollbar hover:bg-scrollbar-hover">스크롤바</div>
```# 디자인 토큰 활용

### 1. Semantic 토큰 우선 사용

의미가 부여된 토큰을 최우선으로 사용하세요:

```tsx
// ✅ 권장: Semantic 토큰 사용
<button className="outline-ring bg-button-primary-bg text-button-primary-text">
  Primary Button
</button>

// ❌ 비권장: 직접 CSS 변수 사용
<button className="bg-[var(--color-bg-on-button-brand-default)]">
  Primary Button
</button>
```

### 2. 주요 Semantic 유틸리티 클래스

#### Focus 스타일
- `outline-ring`: 기본 포커스 아웃라인 (2px offset)
- `outline-ring-0`: 포커스 아웃라인 (0px offset)
- `outline-ring-none`: 투명한 포커스 아웃라인

#### 버튼 스타일
- `btn-small`, `btn-medium`, `btn-large`: 버튼 크기
- `btn-icon-small`, `btn-icon-medium`, `btn-icon-large`: 아이콘 버튼 크기
- `border-button-2nd`, `border-button-primary`: 버튼 테두리

#### 텍스트 박스 스타일
- `border-text-box-default`, `border-text-box-hover`, `border-text-box-focus`: 텍스트 박스 테두리 상태
- `text-box-small`, `text-box-medium`: 텍스트 박스 크기

#### 타이포그래피
- `typo-body`: 본문 텍스트 (14px, 400 weight)
- `typo-caption`: 캡션 텍스트 (12px, 400 weight)
- `typo-caption-mono`: 모노스페이스 캡션
- `typo-button-label-small`, `typo-button-label-medium`: 버튼 라벨

### 3. Primitive 토큰 사용

Semantic 토큰이 없는 경우 Primitive 토큰을 사용하세요:

```tsx
// ✅ 권장: CSS 변수를 통한 Primitive 토큰 사용
<div className="bg-[var(--colors-neutral-neutral-04)] text-[var(--colors-neutral-neutral-15)]">
  Content
</div>

// ✅ 권장: 간격 토큰
<div className="p-[var(--spacing-8px)] m-[var(--spacing-12px)]">
  Content
</div>
```

## 컴포넌트별 스타일링 패턴

### 버튼 컴포넌트

```tsx
const Button = ({ variant, size, children, ...props }) => {
  return (
    <button
      className={cn(
        // 기본 스타일
        "focus-visible:outline-ring inline-flex items-center justify-center gap-[var(--spacing-button-gap-default)] rounded-[var(--radius-xs)] transition-colors",
        // 크기별 스타일
        size === "small" && "btn-small typo-button-label-small",
        size === "medium" && "btn-medium typo-button-label-medium",
        size === "large" && "btn-large typo-button-label-medium",
        // 변형별 스타일
        variant === "primary" && "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-bg-hover disabled:bg-button-primary-bg-disabled",
        variant === "secondary" && "border-button-2nd bg-button-2nd-bg text-button-2nd-text hover:border-button-2nd-hover"
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

### 입력 필드 컴포넌트

```tsx
const Textbox = ({ size, variant, className, ...props }) => {
  return (
    <input
      className={cn(
        // 기본 스타일
        "focus-visible:outline-ring w-full rounded-[var(--radius-xs)] transition-colors",
        "border-text-box-default focus:border-text-box-focus hover:border-text-box-hover",
        // 크기별 스타일
        size === "small" && "text-box-small",
        size === "medium" && "text-box-medium",
        // 변형별 스타일
        variant === "ghost" && "border-text-box-ghost-populated",
        className
      )}
      {...props}
    />
  )
}
```

## 디자인 토큰 카테고리

### 색상 토큰

#### Semantic 색상
- `--color-brand`: 브랜드 색상
- `--color-danger`: 위험/오류 색상
- `--color-warning`: 경고 색상
- `--color-success`: 성공 색상
- `--color-neutral-1st`, `--color-neutral-2nd`, `--color-neutral-3rd`: 중성 텍스트 색상

#### Primitive 색상 (17단계 중성 색상)
- `--colors-neutral-neutral-01` ~ `--colors-neutral-neutral-17`: 중성 색상 팔레트
- `--colors-wafer-blue-wafer-blue-01` ~ `--colors-wafer-blue-wafer-blue-16`: 웨이퍼 블루 팔레트
- `--colors-oxygen-red-o-red-01` ~ `--colors-oxygen-red-o-red-16`: 옥시젠 레드 팔레트
- `--colors-die-green-die-green-01` ~ `--colors-die-green-die-green-16`: 다이 그린 팔레트

### 간격 토큰

#### Semantic 간격 (Compact 밀도 - 기존 가이드 기준)
- `--spacing-sm`: 4px - 작은 간격 (p-sm, gap-sm 등으로 사용)
- `--spacing-md`: 8px - 중간 간격 (p-md, gap-md 등으로 사용)
- `--spacing-lg`: 16px - 큰 간격 (p-lg, gap-lg 등으로 사용)
- `--spacing-xl`: 24px - 매우 큰 간격 (p-xl, gap-xl 등으로 사용, TBD)
- `--spacing-2xl`: 32px - 2배 큰 간격 (p-2xl, gap-2xl 등으로 사용, TBD)
- `--spacing-3xl`: 40px - 3배 큰 간격 (p-3xl, gap-3xl 등으로 사용, TBD)

#### Semantic 간격 기본 스케일
- `--spacing-1` ~ `--spacing-7`: 기본 스케일 (4px 기준, 4px ~ 28px)

#### Primitive 간격
- `--spacing-2px`, `--spacing-4px`, `--spacing-8px`, `--spacing-12px`, `--spacing-16px` 등: 픽셀 기반 정확한 간격

### 타이포그래피 토큰

#### Samsung One Korean NoF (SOK)
- `--typo-sok-h1-44-700` ~ `--typo-sok-h7-12-700`: 제목 스타일
- `--typo-sok-body-14-400`: 본문 텍스트
- `--typo-sok-caption-12-400`: 캡션 텍스트
- `--typo-sok-footnote-11-400`: 각주 텍스트

#### Samsung Sharp Sans (SSS) - 제목용
- `--typo-sss-h1-40-700` ~ `--typo-sss-h5-13-700`: 제목 전용 스타일

### 반경(Radius) 토큰
- `--radius-xs`: 2px (기본 컴포넌트 반경)
- `--radius-sm`, `--radius-md`, `--radius-lg`: 다양한 크기의 반경

### 그림자 토큰
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`: 엘리베이션 그림자
- `elevation-dropdown`, `elevation-modal`, `elevation-tooltip`: 컴포넌트별 엘리베이션

## 업데이트된 Semantic 토큰 활용 가이드

### 색상 토큰 사용 예시

```tsx
// 기존 가이드 기준 상태별 색상
<button className="bg-brand hover:bg-brand-hover text-white">브랜드 버튼</button>
<div className="text-danger">오류 메시지</div>
<div className="bg-success text-white">성공 알림</div>
<span className="text-warning">경고 텍스트</span>
<div className="text-info">정보 텍스트</div>

// 기존 가이드 기준 중립 색상
<h1 className="text-neutral-1st">주요 제목</h1>
<p className="text-neutral-2nd">보조 텍스트</p>
<small className="text-neutral-3rd">비활성 텍스트</small>

// 콘텐츠 계층 색상 (추가된 semantic 토큰)
<h1 className="text-heading">페이지 제목</h1>
<h2 className="text-primary">섹션 제목</h2>
<p className="text-body">본문 내용</p>
<span className="text-secondary">부가 설명</span>
<small className="text-caption">캡션</small>
<span className="text-muted">힌트 텍스트</span>
<span className="text-disabled">비활성화됨</span>

// 배경 및 인터랙티브 색상
<div className="bg-surface-primary">메인 배경</div>
<div className="bg-surface-secondary">카드 배경</div>
<div className="hover:bg-hover-bg">호버 가능한 영역</div>
<button className="text-accent hover:text-accent-hover">액센트 버튼</button>
<div className="bg-accent-light">연한 액센트 배경</div>

// 특수 컴포넌트 색상
<div className="bg-scrollbar hover:bg-scrollbar-hover">스크롤바</div>
<div className="border-light">연한 테두리</div>
<div className="border-medium">중간 테두리</div>
```

### Spacing 토큰 사용 예시

```tsx
// Semantic spacing (권장)
<div className="p-sm">작은 패딩 (4px)</div>
<div className="p-md">중간 패딩 (8px)</div>
<div className="p-lg">큰 패딩 (16px)</div>
<div className="gap-lg">큰 간격 (16px)</div>
<div className="space-y-xl">세로 여백 XL (24px)</div>

// Primitive spacing (정확한 값이 필요한 경우)
<div className="p-4px">4픽셀 패딩</div>
<div className="p-12px">12픽셀 패딩</div>
<div className="p-20px">20픽셀 패딩</div>
```

### Border Width 토큰 사용 예시

```tsx
// Semantic border width
<div className="border-l-[var(--border-width-accent)]">강조 왼쪽 테두리 (4px)</div>
```

### 1. 클래스 순서
Prettier와 ESLint 플러그인을 사용하여 클래스 순서를 자동 정렬하세요:

```tsx
// ✅ 올바른 순서 (자동 정렬됨)
<div className="focus-visible:outline-ring flex size-full items-center justify-center bg-surface p-4 text-foreground">
```

### 2. 동적 클래스 생성
Class Variance Authority (CVA)를 사용하여 동적 스타일을 관리하세요:

```tsx
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  // 기본 클래스
  "focus-visible:outline-ring inline-flex items-center justify-center rounded-[var(--radius-xs)] transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-bg-hover",
        secondary: "border-button-2nd bg-button-2nd-bg text-button-2nd-text"
      },
      size: {
        small: "btn-small typo-button-label-small",
        medium: "btn-medium typo-button-label-medium"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "medium"
    }
  }
)
```

### 3. 컴포넌트 스타일 분리
복잡한 스타일은 별도 CSS 파일로 분리하고 유틸리티 클래스로 정의하세요:

```css
/* styles/scroll-area.css */
@utility scroll-area-thumb {
  @apply relative flex-1 rounded-full bg-[var(--colors-neutral-neutral-09)] hover:bg-[var(--colors-neutral-neutral-12)];
}
```

### 4. 테마 대응
다크 모드나 테마 변경에 대응할 수 있도록 CSS 변수를 활용하세요:

```tsx
// CSS 변수는 자동으로 테마에 따라 변경됨
<div className="bg-[var(--color-surface)] text-[var(--color-foreground)]">
  Theme-aware content
</div>
```

### 5. 접근성 고려
포커스 상태와 키보드 네비게이션을 항상 고려하세요:

```tsx
<button className="focus-visible:outline-ring hover:bg-button-primary-bg-hover">
  Accessible Button
</button>
```

## 주의사항

### 1. 하드코딩 금지
임의의 색상이나 크기 값을 하드코딩하지 마세요:

```tsx
// ❌ 절대 금지
<div className="bg-blue-500 p-3 text-white">

// ✅ 올바른 방법
<div className="bg-brand p-[var(--spacing-12px)] text-button-primary-text">
```

### 2. 일관성 유지
동일한 기능의 컴포넌트는 동일한 토큰을 사용하세요:

```tsx
// ✅ 일관된 스타일링
const allButtons = "focus-visible:outline-ring rounded-[var(--radius-xs)] transition-colors"
```

### 3. 성능 고려
불필요한 CSS-in-JS나 동적 스타일 생성을 피하고, 가능한 한 정적 클래스를 사용하세요.

## 관련 문서

- [디자인 시스템 가이드](/design/docs/design-system-guide.md)
- [React 개발 가이드](./development-guide.md)
- [React 트러블슈팅](./troubleshooting.md)
