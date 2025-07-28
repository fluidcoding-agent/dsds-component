import * as React from "react"
import { usePlatform } from "@/hooks"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "@/components/icons"

/**
 * Header 내 검색 입력 필드 컴포넌트입니다.
 * Header.Item에서 type: "searchbox"로 사용하거나, Header.Searchbox로 직접 사용합니다.
 *
 * @param props SearchboxProps
 * @example
 * <Header.Searchbox placeholder="Search..." />
 */
import { Searchbox, SearchboxProps } from "./boxes/Searchbox"
import { Button, ButtonProps } from "./Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./DropdownMenu"

const HeaderThemeContext = React.createContext<"light" | "dark">("light")

/**
 * Header 스타일 변형을 위한 cva 인스턴스입니다.
 * @private
 */
const headerVariants = cva("flex w-full items-center bg-header-bg text-header-text elevation-header", {
  variants: {
    theme: {
      dark: "",
      light: "",
    },
    size: {
      compact: "h-[40px] px-[12px]",
      cozy: "h-20 px-10 pr-8 py-5",
    },
  },
})

/**
 * Header에서 사용할 수 있는 아이템 타입입니다.
 * - tenant: 테넌트 선택 버튼
 * - menu: 드롭다운 메뉴 트리거
 * - link: 네비게이션 링크
 * - button: 일반 버튼
 * - divider: 구분선
 * - image: 프로필 등 이미지
 * - custom: 커스텀 React 노드
 * - hamburger: 햄버거 메뉴 버튼
 */
export type HeaderMenuItem = {
  content: React.ReactNode
  value: string
  disabled?: boolean
}

const HeaderSearchbox = ({ className, placeholder, ...props }: SearchboxProps) => (
  <div className="pr-2">
    <Searchbox
      {...props}
      placeholder={placeholder || "Search"}
      className={cn("header-searchbox typo-sok-caption-12-400", className)}
      wrapperClassName={cn(
        "border-header-searchbox-default header-searchbox-wrapper [.box-wrapper]:bg-header-searchbox-bg pl-1 w-[80px]",
        props.wrapperClassName
      )}
      size="small"
    />
  </div>
)
HeaderSearchbox.displayName = "Header.Searchbox"

export type HeaderItem =
  | {
      type: "tenant"
      content: React.ReactNode
      items: HeaderMenuItem[]
      onSelect?: (value: string) => void
      selected?: string
      props?: React.ButtonHTMLAttributes<HTMLButtonElement>
    }
  | {
      type: "menu"
      content: React.ReactNode
      items: HeaderMenuItem[]
      onSelect?: (value: string) => void
      selected?: string
      props?: React.ButtonHTMLAttributes<HTMLButtonElement>
    }
  | {
      type: "link"
      href: string
      props?: React.AnchorHTMLAttributes<HTMLAnchorElement>
      content: React.ReactNode
    }
  | {
      type: "button"
      props?: React.ButtonHTMLAttributes<HTMLButtonElement> & { badge?: boolean }
      content: React.ReactNode
      badge?: boolean
    }
  | { type: "divider"; props?: React.HTMLAttributes<HTMLDivElement> }
  | { type: "image"; props: React.ImgHTMLAttributes<HTMLImageElement> }
  | { type: "custom"; props?: React.HTMLAttributes<HTMLDivElement>; content: React.ReactNode }
  | { type: "hamburger"; props?: React.ButtonHTMLAttributes<HTMLButtonElement>; content?: React.ReactNode }
  | { type: "searchbox"; props?: SearchboxProps }

/**
 * Header 컴포넌트의 props입니다.
 * @property {React.ReactNode} logo - 로고 영역에 표시될 텍스트 또는 ReactNode
 * @property {"a" | "h1" | "div"} [logoAs] - 로고를 감쌀 태그 타입 (기본값: "a")
 * @property {HeaderItem[]} [items] - Header에 표시할 아이템 배열
 * @property {HeaderItem[]} [gnb] - GNB(Global Navigation Bar)에 표시할 아이템 배열
 * @property {HeaderItem[]} [utility] - Utility 영역에 표시할 아이템 배열
 * @property {boolean} [asChild] - Slot 컴포넌트로 감쌀지 여부
 * @property {"light" | "dark"} [theme] - 헤더 테마
 * @property {"compact" | "comfortable"} [size] - 헤더 높이/패딩 사이즈
 * @property {"default" | "sticky"} [variant] - sticky 등 변형 스타일
 * @property {React.ReactNode} [children] - 직접 커스텀 레이아웃을 넣을 때 사용
 */
export interface HeaderProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof headerVariants> {
  logo?: React.ReactNode
  logoAs?: "a" | "h1" | "div"
  gnb?: HeaderItem[]
  utility?: HeaderItem[]
  asChild?: boolean
  sticky?: boolean
}

/**
 * 드롭다운 메뉴 트리거 역할의 버튼 컴포넌트입니다.
 * Header.Item에서 type: "menu"로 사용하거나, Header.Menu로 직접 사용합니다.
 *
 * @param props React.ButtonHTMLAttributes<HTMLButtonElement>
 * @example
 * <Header.Menu>Menu</Header.Menu>
 */
type HeaderMenuProps = {
  items: HeaderMenuItem[]
  onSelect?: (value: string) => void
  selected?: string
  children?: React.ReactNode
  labelClassName?: string
  iconClassName?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect">

const HeaderMenu = React.forwardRef<HTMLButtonElement, HeaderMenuProps>(
  ({ children, className, items, onSelect, selected, labelClassName, iconClassName, ...props }, ref) => {
    const theme = React.useContext(HeaderThemeContext)
    const { isWindows, isMacOS } = usePlatform()

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            {...props}
            className={cn(
              "text-header-button flex items-center gap-1 rounded-xs py-[4px] pr-[6px] pl-[8px]",
              theme === "light" && "hover:bg-[rgba(40,48,55,0.08)]",
              theme === "dark" && "hover:bg-[rgba(255,255,255,0.08)]",
              className
            )}
          >
            <div className={cn("header-menu-label typo-sok-h6-14-700 truncate", labelClassName)}>{children}</div>
            <ChevronDownIcon
              size={14}
              className={iconClassName || cn(isWindows && "mt-[1px]", isMacOS && "mt-[0px] p-[1px]", iconClassName)}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {items.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onSelect={() => !item.disabled && onSelect?.(item.value)}
              aria-selected={selected === item.value}
              aria-disabled={item.disabled}
              disabled={item.disabled}
              role="menuitem"
            >
              {item.content}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
HeaderMenu.displayName = "Header.Menu"

/**
 * Header 내 테넌트 선택 버튼 컴포넌트입니다.
 * Header.Item에서 type: "tenant"로 사용하거나, Header.Tenant로 직접 사용합니다.
 *
 * @param props React.ButtonHTMLAttributes<HTMLButtonElement>
 * @example
 * ```jsx
 * <Header.Tenant items={[{ content: '기흥캠퍼스', value: 'giheung' }, { content: '화성캠퍼스', value: 'hwaseong' }]} />
 * ```
 */
const HeaderTenant = React.forwardRef<HTMLButtonElement, HeaderMenuProps>(
  ({ className, labelClassName, iconClassName, ...props }, ref) => {
    const { isWindows, isMacOS } = usePlatform()
    return (
      <HeaderMenu
        ref={ref}
        {...props}
        className={cn("header-tenant", className)}
        // 윈도에서 mb-[-2px] 시각적 보정
        labelClassName={cn("typo-sss-h5-13-700", isWindows && "pt-[4px] mb-[-2px]", isMacOS && "pt-0", labelClassName)}
        iconClassName={cn(isWindows && "mt-[-1px]", isMacOS && "mt-[2px]", iconClassName)}
      />
    )
  }
)
HeaderTenant.displayName = "Header.Tenant"

/**
 * Header 내 햄버거 메뉴 버튼 컴포넌트입니다.
 * Header.Item에서 type: "hamburger"로 사용하거나, Header.HamburgerMenu로 직접 사용합니다.
 *
 * @param props React.ButtonHTMLAttributes<HTMLButtonElement>
 * @example
 * <Header.HamburgerMenu />
 */
const HeaderHamburgerMenu = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...props}
    className={cn("header-hamburger flex items-center justify-center p-2 text-sm", props.className)}
    data-testid="header-hamburger-menu"
  >
    {children || (
      <div data-testid="hamburger-icon" className="flex flex-col gap-1">
        <div className="h-0.5 w-4 bg-current" />
        <div className="h-0.5 w-4 bg-current" />
        <div className="h-0.5 w-4 bg-current" />
      </div>
    )}
  </button>
)
HeaderHamburgerMenu.displayName = "Header.HamburgerMenu"

/**
 * Header 내 GNB(Global Navigation Bar) 컨테이너 컴포넌트입니다.
 * 커스텀 레이아웃에서 GNB 영역을 정의할 때 사용합니다.
 *
 * @param props React.HTMLAttributes<HTMLDivElement>
 * @example <pre><code>
 * <Header.GNB>
 *   <Header.Menu>홈</Header.Menu>
 *   <Header.Menu>문서</Header.Menu>
 * </Header.GNB>
 * </code></pre>
 */
const HeaderGNB = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={cn("header-gnb flex h-[28px] max-h-[28px] min-h-[28px] items-center", props.className)}
    data-testid="header-gnb"
  >
    {children}
  </div>
)
HeaderGNB.displayName = "Header.GNB"

/**
 * Header 내 Utility 영역 컨테이너 컴포넌트입니다.
 * 커스텀 레이아웃에서 Utility 영역을 정의할 때 사용합니다.
 * 기본적으로 margin-left: auto가 적용됩니다.
 *
 * @param props React.HTMLAttributes<HTMLDivElement>
 * @example
 * <Header.Utility>
 *   <Header.Button>알림</Header.Button>
 *   <Header.Image src="/avatar.png" alt="User" />
 * </Header.Utility>
 */
const HeaderUtility = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={cn("flex items-center", props.className)}
    style={{ marginLeft: "auto" }}
    data-testid="header-utility"
  >
    {children}
  </div>
)
HeaderUtility.displayName = "Header.Utility"

/**
 * Header 내 구분선(세로선) 컴포넌트입니다.
 * Header.Item에서 type: "divider"로 사용하거나, Header.Divider로 직접 사용합니다.
 *
 * @param props React.HTMLAttributes<HTMLDivElement>
 * @example
 * <Header.Divider />
 */
const HeaderDivider = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const theme = React.useContext(HeaderThemeContext)
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-hidden="true"
      {...props}
      className="flex h-[10px] items-center justify-center px-1"
    >
      <div
        className={cn(
          "h-[10px] min-w-[1px]",
          theme === "dark" ? "bg-white opacity-20" : "bg-[var(--colors-neutral-neutral-10)] opacity-40",
          props.className
        )}
      ></div>
    </div>
  )
}
HeaderDivider.displayName = "Header.Divider"

type HeaderButtonProps = ButtonProps & {
  className?: string
  children: React.ReactNode
  badge?: boolean
}

/**
 * Header 내 버튼 컴포넌트입니다.
 * Header.Item에서 type: "button"으로 사용하거나, Header.Button으로 직접 사용합니다.
 *
 * @param props React.ButtonHTMLAttributes<HTMLButtonElement>
 * @example
 * <Header.Button>Login</Header.Button>
 */
const HeaderButton = React.forwardRef<HTMLButtonElement, HeaderButtonProps>(
  ({ className, children, badge, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghostLink"
        {...props}
        aria-label={props["aria-label"]}
        className={cn(
          "typo-button-label-small-light text-header-button relative flex items-center truncate rounded-xs py-[3px] pr-[6px] pl-[8px] hover:bg-transparent hover:underline",
          className
        )}
      >
        {children}
        {badge && (
          <div className="absolute top-0 right-0 size-[6px] min-h-[6px] min-w-[6px] rounded-full border-1 border-[#ff6056] bg-[#e82c1f]"></div>
        )}
      </Button>
    )
  }
)
HeaderButton.displayName = "Header.Button"

type HeaderLinkProps = {
  href?: string
  className?: string
  children: React.ReactNode
}

const HeaderLink = React.forwardRef<HTMLAnchorElement, HeaderLinkProps>(({ className, href, ...props }, ref) => {
  return (
    <a href={href} ref={ref}>
      <HeaderButton {...props} className={cn("header-link", className)} />
    </a>
  )
})

/**
 * Header 내 이미지(프로필 등) 컴포넌트입니다.
 * Header.Item에서 type: "image"로 사용하거나, Header.Image로 직접 사용합니다.
 *
 * @param props React.ImgHTMLAttributes<HTMLImageElement>
 * @example
 * <Header.Image src="/avatar.png" alt="User" />
 */
const HeaderImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} className={cn("h-8 w-8 rounded-full", props.className)} />
)
HeaderImage.displayName = "Header.Image"

/**
 * Header 로고 영역 컴포넌트입니다.
 * as prop으로 "a", "h1", "div" 등 태그를 지정할 수 있습니다.
 *
 * @param props HeaderLogoProps
 * @example
 * <Header.Logo as="h1">MyApp</Header.Logo>
 */
export interface HeaderLogoProps extends React.HTMLAttributes<HTMLElement> {
  as?: "a" | "h1" | "div"
  children: React.ReactNode
}
const HeaderLogo = React.forwardRef<HTMLElement, HeaderLogoProps>(
  ({ as: Component = "a", children, className, ...props }, ref) => {
    const { isWindows, isMacOS } = usePlatform()

    const logoProps: React.AllHTMLAttributes<HTMLElement> = {
      ...props,
    }

    if (Component === "a") {
      ;(logoProps as React.AnchorHTMLAttributes<HTMLAnchorElement>).href = "/"
    }

    if (typeof children === "string") {
      logoProps["aria-label"] = `${children} homepage`
    }

    return React.createElement(
      Component,
      {
        ...logoProps,
        "data-testid": "header-logo",
        ref,
        className: cn(
          "typo-header-logo-title",
          isMacOS && "pt-[1px]",
          isWindows && "pt-[4px]",
          "mr-[8px] pb-[2px]",
          className
        ),
      },
      children
    )
  }
)
HeaderLogo.displayName = "Header.Logo"

/**
 * Header의 메인 컴포넌트입니다.
 * - `logo`, `gnb`, `utility` props 그룹으로 데이터 기반으로 Header를 구성할 수 있습니다.
 * - children prop을 사용하면 완전히 커스텀 레이아웃도 지원합니다.
 *
 * ### 구성
 *
 * ![header-anatomy](/static/images/dsds/header-anatomy.png)
 *
 * 각 그룹은 다음과 같은 역할을 합니다:
 * - **Logo**: 서비스 로고 또는 타이틀을 표시합니다.
 * - **GNB** (Global Navigation Bar): Tenant 와 드롭다운 Menu를 포함한 탐색 가능한 메뉴입니다.
 *   - **Tenant**: 현재 사용 중인 테넌트(서비스 영역. 기흥/화성, MEM/FDRY 등)를 표시합니다.
 *     드롭다운 메뉴로 다른 테넌트로 전환할 수 있습니다.
 * - **Utility**: Searchbox, 버튼(뱃지 포함), 로그인 버튼, 프로필 이미지, 햄버거 메뉴 등 추가적인 기능을 제공합니다.
 *
 * ### 예제
 *
 * **기본 예제:**
 *
 * ```jsx
 * <Header logo="MyApp" gnb={[{type: "menu", content: "Docs"}]} utility={[{type: "button", content: "Login"}]} />
 * ```
 *
 * **커스텀 레이아웃 예제:**
 * ```jsx
 * <Header>
 *   <Header.Logo>MyApp</Header.Logo>
 *   <Header.GNB>
 *      <Header.Tenant items={[{content: 'Tenant1', value: 'Tenant1'}]}/>
 *      <Header.Divider />
 *      <Header.Menu items={[{content: 'Menu1-1', value: 'menu1-1'}]}/>
 *      <Header.Menu items={[{content: 'Menu2-1', value: 'menu2-1'}]}/>
 *   </Header.GNB>
 *   <Header.Utility>
 *      <Header.Searchbox placeholder="Search..." />
 *      <Header.Button notiCount={3}>Notification</Header.Button>
 *      <Header.Button badge>Update</Header.Button>
 *      <Header.Divider />
 *      <Header.Button>Q&A</Header.Button>
 *      <Header.Button>Help Desk</Header.Button>
 *      <Header.Divider />
 *      <Header.Button aria-label="login button">Admin</Header.Button>
 *      <Header.Button aria-label="profile image" icon={<DummyIcon />} />
 *      <Header.Image aria-label="confidential image" src={<ConfidentialLogo />} />
 *      <Header.Divider />
 *      <Header.HamburgerMenu items=[{content: 'Ham1', value: 'ham1'}] />
 *   </Header.Utility>
 * </Header.GNB>
 * </Header>
 * ```
 */
const HeaderRoot = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      className,
      theme = "light",
      size = "compact",
      children,
      logo,
      logoAs = "a",
      gnb,
      utility,
      sticky: isSticky,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "header"

    // 아이템을 렌더링하는 헬퍼 함수
    const renderItem = (item: HeaderItem, index: number) => {
      const key = `${item.type}-${index}`
      switch (item.type) {
        case "link":
          return (
            <HeaderLink key={key} href={item.href} {...item.props}>
              {item.content}
            </HeaderLink>
          )
        case "menu":
          return (
            <HeaderMenu key={key} items={item.items} onSelect={item.onSelect} selected={item.selected}>
              {item.content}
            </HeaderMenu>
          )
        case "tenant":
          return (
            <HeaderTenant key={key} items={item.items} onSelect={item.onSelect} selected={item.selected}>
              {item.content}
            </HeaderTenant>
          )
        case "button": {
          return (
            <HeaderButton key={key} {...item.props}>
              {item.content}
            </HeaderButton>
          )
        }
        case "divider":
          return <HeaderDivider key={key} {...item.props} />
        case "image":
          return <HeaderImage key={key} {...item.props} />
        case "custom":
          return (
            <div key={key} {...item.props}>
              {item.content}
            </div>
          )
        case "hamburger":
          return (
            <HeaderHamburgerMenu key={key} {...item.props}>
              {item.content}
            </HeaderHamburgerMenu>
          )
        case "searchbox":
          return <HeaderSearchbox key={key} {...item.props} />
        default:
          return null
      }
    }

    return (
      <HeaderThemeContext.Provider value={theme || "light"}>
        <Comp
          className={cn(
            headerVariants({ size, theme, className }),
            theme === "light" && "header-theme-light",
            theme === "dark" && "header-theme-dark",
            isSticky &&
              "bg-header-bg/95 supports-[backdrop-filter]:bg-header-bg/70 sticky top-[-1px] z-50 backdrop-blur"
          )}
          ref={ref}
          {...props}
        >
          {/* children이 있으면 그대로 렌더링 (커스텀 레이아웃 지원) */}
          {children ?? (
            // children이 없으면 logo과 items/gnb/utility 기반으로 기본 레이아웃 렌더링
            <div className="flex w-full items-center">
              {logo && <HeaderLogo as={logoAs}>{logo}</HeaderLogo>}
              {gnb && gnb.length > 0 && <HeaderGNB>{gnb.map(renderItem)}</HeaderGNB>}
              {utility && utility.length > 0 && <HeaderUtility>{utility.map(renderItem)}</HeaderUtility>}
            </div>
          )}
        </Comp>
      </HeaderThemeContext.Provider>
    )
  }
)
HeaderRoot.displayName = "Header"

/**
 * Header 컴포넌트는 서비스 상단에 위치하며, Logo, GNB(Global Navigation Bar), Utility로 구성된 Navigation 그룹입니다.
 * - Logo: 서비스 로고 또는 타이틀을 표시합니다.
 * - GNB: Tenant 와 드롭다운 Menu를 포함한 탐색 가능한 메뉴입니다.
 *   - Tenant: 현재 사용 중인 테넌트(서비스 영역. 예: 기흥/화성, MEM/FDRY' 등)를 표시합니다. 드롭다운 메뉴로 다른 테넌트로 전환할 수 있습니다.
 * - Utility: Searchbox, 버튼(뱃지 포함), 로그인 버튼, 프로필 이미지, 햄버거 메뉴 등 추가적인 기능을 제공합니다.
 *
 * @example <code><pre>
 * <Header logo="MyApp" gnb=[{...}] utility={[{type: "link", content: "Home", href: "/"}]} />
 * <!-- 커스텀 레이아웃 -->
 * <Header>
 *   <Header.Logo>MyApp</Header.Logo>
 *   <Header.GNB>
 *      <Header.Tenant items=[{content: 'Tenant1', value: 'Tenant1'}]/>
 *      <Header.Divider />
 *      <Header.Menu items=[{content: 'Menu1-1', value: 'menu1-1'}]/>
 *      <Header.Menu items=[{content: 'Menu2-1', value: 'menu2-1'}]/>
 *   </Header.GNB>
 *   <Header.Utility>
 *      <Header.Searchbox placeholder="Search..." />
 *      <Header.Button notiCount={3}>Notification</Header.Button>
 *      <Header.Button badge>Update</Header.Button>
 *      <Header.Divider />
 *      <Header.Button>Q&A</Header.Button>
 *      <Header.Button>Help Desk</Header.Button>
 *      <Header.Divider />
 *      <Header.Button aria-label="login button">Admin</Header.Button>
 *      <Header.Button aria-label="profile image" icon={<DummyIcon />} />
 *      <Header.Image aria-label="confidential image" src={<ConfidentialLogo />} />
 *      <Header.Divider />
 *      <Header.HamburgerMenu items=[{content: 'Ham1', value: 'ham1'}] />
 *   </Header.Utility>
 * </Header.GNB>
 * </Header>
 * </code></pre>
 */
const Header = Object.assign(HeaderRoot, {
  Link: HeaderLink,
  Menu: HeaderMenu,
  Divider: HeaderDivider,
  Button: HeaderButton,
  Image: HeaderImage,
  Logo: HeaderLogo,
  Tenant: HeaderTenant,
  HamburgerMenu: HeaderHamburgerMenu,
  GNB: HeaderGNB,
  Utility: HeaderUtility,
  Searchbox: HeaderSearchbox,
})

// 선언 병합(Declaration Merging)을 위한 namespace를 정의합니다.
// 이 namespace는 Header 함수와 동일한 이름을 가집니다.
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Header {
  /**
   * @see HeaderLink
   */
  export type Link = typeof HeaderLink
  /**
   * @see HeaderMenu
   */
  export type Menu = typeof HeaderMenu
  /**
   * @see HeaderDivider
   */
  export type Divider = typeof HeaderDivider
  /**
   * @see HeaderButton
   */
  export type Button = typeof HeaderButton
  /**
   * @see HeaderImage
   */
  export type Image = typeof HeaderImage
  /**
   * @see HeaderLogo
   */
  export type Logo = typeof HeaderLogo
  /**
   * @see HeaderTenant
   */
  export type Tenant = typeof HeaderTenant
  /**
   * @see HeaderHamburgerMenu
   */
  export type HamburgerMenu = typeof HeaderHamburgerMenu
  /**
   * @see HeaderGNB
   */
  export type GNB = typeof HeaderGNB
  /**
   * @see HeaderUtility
   */
  export type Utility = typeof HeaderUtility
  /**
   * @see HeaderSearchbox
   */
  export type Searchbox = typeof HeaderSearchbox
}

export { Header }
