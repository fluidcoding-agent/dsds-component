# React 개발 가이드

## React + Radix UI 개발 가이드

DSDS React 패키지는 Radix UI를 기반으로 구축되어 있습니다.

## 주요 가이드

- **[스타일링 가이드](./styling-guide.md)**: TailwindCSS v4와 디자인 토큰 활용법
- **[트러블슈팅](./troubleshooting.md)**: 일반적인 문제 해결 방법

### 컴포넌트 개발

#### 표준 구현

```tsx
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "btn-medium",
  {
    variants: {
      variant: {
        primary: "bg-button-primary-bg text-button-primary-text",
        secondary: "bg-button-2nd-bg text-button-2nd-text border-button-2nd",
        warning: "bg-button-warning-bg text-button-warning-text",
        danger: "bg-button-danger-bg text-button-danger-text",
        ghost: "bg-transparent hover:bg-button-ghost-bg",
        ghostLink: "bg-transparent text-button-ghost-link-text hover:underline"
      },
      size: {
        small: "btn-small",
        medium: "btn-medium",
        large: "btn-large"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "medium"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  active?: boolean
  selected?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, active, selected, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          active && "btn-active",
          selected && "btn-selected",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

### 타입 정의

```typescript
// 공통 컴포넌트 props 타입
export interface BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'warning' | 'danger' | 'ghost' | 'ghostLink'
  size?: 'small' | 'medium' | 'large'
  active?: boolean
  selected?: boolean
  disabled?: boolean
}

// 확장 가능한 컴포넌트 props
export interface ExtendedComponentProps<T = HTMLElement>
  extends BaseComponentProps,
    React.HTMLAttributes<T> {
  asChild?: boolean
}
```

### Radix UI 통합

```tsx
import * as RadixDialog from "@radix-ui/react-dialog"

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger
export const DialogPortal = RadixDialog.Portal
export const DialogClose = RadixDialog.Close

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <RadixDialog.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </RadixDialog.Content>
  </DialogPortal>
))
DialogContent.displayName = RadixDialog.Content.displayName
```

### 스타일링 Best Practices

#### 1. TailwindCSS 유틸리티 클래스 활용

```tsx
// 권장: 디자인 토큰 기반 유틸리티 클래스
<div className="bg-button-primary-bg text-button-primary-text rounded-xs p-2">
  Content
</div>

// 비권장: 하드코딩된 값
<div className="bg-blue-500 text-white rounded p-2">
  Content
</div>
```

#### 2. Class Variance Authority (CVA) 사용

```tsx
const cardVariants = cva(
  "rounded-lg border shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "p-4",
        sm: "p-2",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### 컴포넌트 컴포지션

```tsx
// 복합 컴포넌트 패턴
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
}

// 사용법
<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>
    Content goes here
  </Card.Content>
</Card.Root>
```

### 상태 관리

```tsx
// 로컬 상태
const [isOpen, setIsOpen] = useState(false)

// 폼 상태 (react-hook-form)
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    email: "",
  },
})

// 전역 상태 (zustand)
const useStore = create<State>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

### 접근성 (a11y)

```tsx
// ARIA 속성 활용
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  aria-controls="dialog-content"
  onClick={() => setIsOpen(false)}
>
  <X aria-hidden="true" />
</button>

// 키보드 네비게이션
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    setIsOpen(false)
  }
}
```

### 테스팅

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Test Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-button-primary-bg')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 스토리북 작성

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'warning', 'danger', 'ghost', 'ghostLink'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghostLink">Ghost Link</Button>
    </div>
  ),
}
```

### 성능 최적화

```tsx
// React.memo로 불필요한 리렌더링 방지
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>
})

// useMemo로 계산 결과 캐싱
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(props.data)
}, [props.data])

// useCallback으로 함수 참조 안정화
const handleClick = useCallback(() => {
  onButtonClick(id)
}, [id, onButtonClick])
```
