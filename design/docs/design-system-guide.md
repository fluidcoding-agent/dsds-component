# 디자인 토큰을 활용한 UI 스타일링 온보딩 가이드

## 소개

이 가이드는 초보 프로그래머가 디자인 토큰, CSS 변수, TailwindCSS 유틸리티 클래스 및 테마를 이해하고 작업하는 데 도움을 주기 위해 작성되었습니다.

### 디자인 토큰 이해하기

디자인 토큰은 디자인 시스템의 기본 구성 요소입니다. **DSDS**(DS 디자인 시스템)은 [브래드 프로스트의 아토믹 디자인 방법론](https://atomicdesign.bradfrost.com/)에 기반하여 설계되었습니다.

디자인 토큰이란 원자(아원자)와 같이 더이상 쪼개지지 않은 디자인 시스템의 가장 작은 단위입니다. 개발자 분들이라면 일종의 글로벌 변수(Global Variable) 개념으로 이를 이해하시면 좋습니다.

디자인 토큰은 **두 가지** 범주로 구성되어 있습니다:

- **Primitives**: 원시 토큰으로 의미가 붙어있지 않은 색상표, 서체, 간격, 선 굵기, 깊이감(Elevation)에 관련된 디자인 토큰입니다.
- **Semantic Tokens**: 의미가 부여된 토큰입니다.

Primitive 디자인 토큰은 CSS Variable (Typo 제외) 로 제공되며, Semantic 디자인 토큰은 tailwindcss 유틸리티 클래스로 제공됩니다.

## Primitive Tokens (원시 토큰)

### 1. Colors (색상)

원시 색상 토큰은 의미가 부여되지 않은 기본 색상 팔레트입니다.
색상의 이름은 DS사업부의 반도체 제조 공정의 Identity를 브랜딩하기 위해
반도체 제조 공정에서 사용되는 소재 또는 용어에 연관지어 지었습니다.
각 토큰들은 CSS 변수로 정의되어 있으며, 다음과 같은 형태로 사용됩니다:

#### No-Color
```css
--colors-no-color    /* 투명 색상 (#00000000) */
```

#### Neutral (중성 색상)
```css
/* 예시 */
--colors-neutral-neutral-01    /* #ffffff */
/* 범위: neutral_01 ~ neutral_17 (17단계) */
```

#### Oxygen Red (산소 빨강)
```css
/* 예시 */
--colors-oxygen-red-o-red-01    /* #fff8f8 */
/* 범위: o_red_01 ~ o_red_16 (16단계) */
/* 추가: o_red_01-2 (대체 색상) */
```

#### Die Green (다이 초록)
```css
/* 예시 */
--colors-die-green-die-green-01    /* #fafdf7 */
/* 범위: die_green_01 ~ die_green_16 (16단계) */
```

#### Copper Yellow (구리 노랑)
```css
/* 예시 */
--colors-copper-yellow-cu-yellow-01    /* #fffcf8 */
/* 범위: cu_yellow_01 ~ cu_yellow_16 (16단계) */
```

#### Gate Purple (게이트 보라)
```css
/* 예시 */
--colors-gate-purple-gate-purple-01    /* #f9fafe */
/* 범위: gate_purple_01 ~ gate_purple_16 (16단계) */
```

#### Wafer Blue (웨이퍼 파랑)
```css
/* 예시 */
--colors-wafer-blue-wafer-blue-01    /* #f7fbfd */
/* 범위: wafer_blue_01 ~ wafer_blue_16 (16단계) */
```

#### PhotoResist Green (포토레지스트 초록)
```css
/* 예시 */
--colors-photoresist-green-pr-green-01    /* #f7fdfd */
/* 범위: pr_green_01 ~ pr_green_16 (16단계) */
```

#### Nitrogen Green (질소 초록)
```css
/* 예시 */
--colors-nitrogen-green-n-green-01    /* #f9fdf9 */
/* 범위: n_green_01 ~ n_green_16 (16단계) */
```

#### Dioxide Film Blue (산화막 파랑)
```css
/* 예시 */
--colors-dioxide-film-blue-df-blue-01    /* #f7fdfe */
/* 범위: df_blue_01 ~ df_blue_16 (16단계) */
```

각 색상 그룹은 일반적으로 01(가장 밝은 색상)부터 16(가장 어두운 색상)까지의 16단계 색상 팔레트를 제공합니다. Neutral 색상은 17단계로 구성되어 있습니다.

### 2. Typography (서체)

원시 타이포그래피 토큰은 두 가지 주요 폰트 패밀리를 기반으로 합니다:

#### SOK - Samsung One Korean NoF
```css
typo-sok-h1-44-700      /* 44px, 700 weight */
typo-sok-h2-32-700      /* 32px, 700 weight */
typo-sok-h3-24-700      /* 24px, 700 weight */
typo-sok-h4-20-700      /* 20px, 700 weight */
typo-sok-h5-16-700      /* 16px, 700 weight */
typo-sok-h6-14-700      /* 14px, 700 weight */
typo-sok-h7-12-700      /* 12px, 700 weight */
typo-sok-body-14-400    /* 14px, 400 weight */
typo-sok-caption-12-400 /* 12px, 400 weight */
typo-sok-footnote-11-400 /* 11px, 400 weight */
```

#### SSS - Samsung Sharp Sans
```css
typo-sss-h1-40-700      /* 40px, 700 weight */
typo-sss-h2-28-700      /* 28px, 700 weight */
typo-sss-h3-22-700      /* 22px, 700 weight */
typo-sss-h4-19-700      /* 19px, 700 weight */
typo-sss-h5-13-700      /* 13px, 700 weight */
```

### 3. Spacing (간격)

원시 간격 토큰은 픽셀 단위로 정의된 정확한 간격값들입니다:

```css
p-0        /* 0px */
p-2px      /* 2px */
p-4px      /* 4px */
p-5px      /* 5px */
p-6px      /* 6px */
p-8px      /* 8px */
p-12px     /* 12px */
p-16px     /* 16px */
p-20px     /* 20px */
p-24px     /* 24px */
p-28px     /* 28px */
p-32px     /* 32px */
p-36px     /* 36px */
p-40px     /* 40px */
```

### 4. Shadows (그림자)

원시 그림자 토큰은 5단계의 깊이감을 제공합니다:

```css
--shadow-1  /* 가장 얕은 그림자 */
--shadow-2  /* 얕은 그림자 */
--shadow-3  /* 중간 그림자 */
--shadow-4  /* 깊은 그림자 */
--shadow-5  /* 가장 깊은 그림자 */
```

각 그림자는 `box-shadow` CSS 속성으로 적용되며, 여러 레이어의 그림자를 조합하여 자연스러운 깊이감을 표현합니다.

### 5. Opacity (투명도)

투명도 토큰은 요소의 불투명도를 제어하는 데 사용됩니다. 일반적으로 0부터 1까지의 값으로 정의됩니다.

## Semantic Tokens (의미 토큰)

### 1. Colors (색상)

의미가 부여된 색상 토큰들은 용도에 따라 분류됩니다:

#### 기본 색상
```css
brand       /* 브랜드 색상 */
info        /* 정보 색상 */
danger      /* 위험/오류 색상 */
warning     /* 경고 색상 */
success     /* 성공 색상 */
```

#### 컴포넌트별 색상
```css
btn-primary    /* 기본 버튼 색상 */
btn-secondary  /* 보조 버튼 색상 */
```

#### 중립 색상
```css
neutral-1st    /* 주요 텍스트 색상 */
neutral-2nd    /* 보조 텍스트 색상 */
neutral-3rd    /* 비활성 텍스트 색상 */
```

### 2. Typography (서체)

의미가 부여된 타이포그래피 토큰들:

#### 일반 사용
```css
typo-body         /* 본문 텍스트 */
typo-caption      /* 캡션 텍스트 */
typo-caption-mono /* 모노스페이스 캡션 */
```

#### 컴포넌트별
```css
typo-heading      /* 제목 텍스트 */
```

### 3. Spacing (간격)

의미가 부여된 간격 토큰들은 밀도(Density)에 따라 구분됩니다. 기본 밀도는 `Compact` 입니다.

#### Density: Compact

```css
p-sm    /* 작은 간격 */
p-md    /* 중간 간격 */
p-lg    /* 큰 간격 */
p-xl    /* 매우 큰 간격 (TBD) */
p-2xl   /* 2배 큰 간격 (TBD) */
p-3xl   /* 3배 큰 간격 (TBD) */
```

#### Density: Cozy (개발 중)

현재 개발 중인 상태입니다.

### 4. Shadows (그림자)

의미가 부여된 그림자 토큰들:

```css
shadow-sm  /* 작은 그림자 */
shadow-md  /* 중간 그림자 */
shadow-lg  /* 큰 그림자 */
```

### 5. Elevations (높이)

높이감을 표현하는 토큰들은 Z-Index와 그림자를 조합하여 사용됩니다:

#### Z-Index 토큰
```css
z-base      /* 기본 레벨 */
z-raised    /* 살짝 올려진 레벨 */
z-dropdown  /* 드롭다운 레벨 */
z-sticky    /* 고정 요소 레벨 */
z-overlay   /* 오버레이 레벨 */
z-modal     /* 모달 레벨 */
z-popover   /* 팝오버 레벨 */
z-toast     /* 토스트 레벨 */
z-tooltip   /* 툴팁 레벨 */
```

#### Elevation 토큰
```css
elevation-dropdown  /* 드롭다운 높이감 */
elevation-modal     /* 모달 높이감 */
elevation-tooltip   /* 툴팁 높이감 */
```

### 6. Border (테두리)

테두리 관련 토큰들:

#### Border Radius (선 곡률)
```css
rounded-xs  /* 아주 작은 모서리 반경. 대부분 컴포넌트의 모서리 기본값 */
rounded-sm  /* 작은 모서리 반경. Card, 컨테이너 등의 모서리 기본값 */
rounded-md  /* 중간 모서리 반경 */
rounded-lg  /* 큰 모서리 반경 */
```

#### Border Width (선 굵기)
```css
border-width-sm  /* 얇은 테두리 */
border-width-md  /* 중간 테두리 */
border-width-lg  /* 두꺼운 테두리 */
```

## 디자인 토큰 사용 방법

### 1. CSS 변수로 접근
```css
.my-component {
  color: var(--colors-brand);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
}
```

### 2. TailwindCSS 클래스로 사용
```html
<button class="bg-brand text-white p-md rounded-sm shadow-sm">
  버튼
</button>
```

### 3. 컴포넌트에서 활용
```tsx
// Button.tsx 예시
const Button = ({ variant = 'primary', size = 'md', children }) => {
  return (
    <button className={`
      ${variant === 'primary' ? 'bg-brand text-white' : 'bg-neutral-100 text-neutral-1st'}
      ${size === 'sm' ? 'p-sm typo-caption' : 'p-md typo-body'}
      rounded-sm shadow-sm
    `}>
      {children}
    </button>
  );
};
```

## 개발 시 주의사항 (Recommendations)

### Basics

1. **Tailwindcss 유틸리티 클래스 우선**: 별도 CSS 파일 보다 Tailwindcss 유틸리티 클래스로 스타일링 하세요.
1. **일관성 유지**: 색상, 간격 등은 항상 디자인 토큰을 사용하여 일관된 디자인을 유지하세요.
2. **의미 우선**: 가능한 한 Semantic 토큰을 우선 사용하고, 필요시에만 Primitive 토큰을 사용하세요.
3. **반응형 고려**: 다양한 화면 크기에서 토큰이 어떻게 작동하는지 확인하세요.
4. **접근성**: 색상 대비, 폰트 크기 등 접근성을 고려하여 토큰을 선택하세요.

### Colors

1. 의미 있는 색상을 가급적 사용하세요, 다른 색을 사용할 경우 **반드시 Primitive Colors** 에 정의된 색상을 tailwindcss 유틸리티 클래스 문법으로 사용하세요
  - 예: `bg-brand bg-danger`
  - 예: `bg-[var(--colors-dioxide-film-blue-df-blue-01)]`

### Typograph

1. **서체**: 의미 있는 서체를 가급적 사용하세요. 적절한 서체가 없을 경우는 Primitive 토큰에 정의된 `typo-*` 유틸리티 클래스를 사용하세요


## 추가 리소스

- [Storybook 문서](packages/tokens/src/stories/docs/)에서 각 토큰의 시각적 예시를 확인하세요.
- [디자인 토큰 개념 가이드](packages/tokens/src/stories/docs/GettingStarted.mdx)에서 더 자세한 정보를 확인하세요.

