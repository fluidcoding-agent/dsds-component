# dsds

shadcn/ui 스타일의 커스텀 UI 컴포넌트 라이브러리입니다.

## 설치

```bash
npm install -g dsds
# 또는
npx dsds@latest init
```

## 사용법

### 1. 프로젝트 초기화

```bash
npx dsds init
```

이 명령어는 다음을 수행합니다:
- `components.json` 설정 파일 생성
- 컴포넌트 디렉토리 생성
- 유틸리티 함수 설정

### 2. 컴포넌트 추가

```bash
# 단일 컴포넌트 추가
npx dsds add button

# 여러 컴포넌트 동시 추가
npx dsds add button card dialog

# 사용 가능한 모든 컴포넌트 추가
npx dsds add --all
```

## 사용 가능한 컴포넌트

- `button` - 다양한 variant와 size를 지원하는 버튼 컴포넌트
- `card` - 카드 레이아웃 컴포넌트
- `dialog` - 모달 다이얼로그 컴포넌트
- `badge` - 뱃지 컴포넌트
- `checkbox` - 체크박스 컴포넌트
- `label` - 라벨 컴포넌트
- `tabs` - 탭 컴포넌트
- `toast` - 토스트 알림 컴포넌트
- `tooltip` - 툴팁 컴포넌트
- 그 외 다수...

## 예제

```tsx
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>예제 카드</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary" size="medium">
          클릭하세요
        </Button>
      </CardContent>
    </Card>
  )
}
```

## 요구사항

- React 18+
- TypeScript
- Tailwind CSS
- 다음 패키지들이 설치되어 있어야 합니다:
  - `@radix-ui/react-slot`
  - `class-variance-authority`
  - `clsx`
  - `tailwind-merge`

## 설정

`components.json` 파일을 통해 다음을 설정할 수 있습니다:

- 컴포넌트 경로
- 유틸리티 함수 경로
- Tailwind CSS 설정
- 별칭(alias) 설정

## 라이센스

MIT