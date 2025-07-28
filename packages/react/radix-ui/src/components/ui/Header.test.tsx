import * as stories from "@/stories/Header/Header.stories"
import * as itemStories from "@/stories/Header/HeaderItems.stories"
import { composeStories } from "@storybook/react-vite"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test, vi } from "vitest"

// composeStories를 사용하여 모든 스토리를 렌더링 가능한 컴포넌트로 변환합니다.
const { Default, CustomLayout, WithGNBAndUtility, CustomLayoutWithGNBUtility } = composeStories(stories)

const { MenuWithItems, HamburgerMenu } = composeStories(itemStories)

// 테스트 파일의 역할은 이제 "스토리를 실행하고 검증하는 것"입니다.
describe("Header Tests with Storybook", () => {
  test("초기 렌더링 시 모든 요소가 올바르게 표시되어야 한다.", () => {
    const logo = Default.args.logo as string
    render(<Default />)

    // <header> 태그는 'banner' role을 가집니다.
    const headerElement = screen.getByRole("banner")
    // '디폴트 theme="light", size="compact" prop에 따라 정의한 클래스가 적용되었는지 확인합니다.
    expect(headerElement).toHaveClass("h-[40px]", "px-[12px]", "header-theme-light", "bg-header-bg", "text-header-text")
    // getByTestId를 사용해 브랜드 로고를 명확하게 찾습니다.
    const brandLogo = screen.getByTestId("header-logo")

    // 2. 브랜드 로고가 올바른 링크와 접근성 레이블을 가졌는지 확인합니다.
    expect(brandLogo).toBeInTheDocument()
    expect(brandLogo).toHaveAttribute("href", "/")
    expect(brandLogo).toHaveAttribute("aria-label", `${logo} homepage`)

    // 3. 다른 일반 메뉴 링크도 여전히 잘 렌더링되는지 확인합니다.
    const featuresLink = screen.getByRole("button", { name: /알림/i })
    expect(featuresLink).toBeInTheDocument()
  })

  test("CustomLayout 스토리가 올바르게 표시되어야 한다.", () => {
    render(<CustomLayout />)

    // 커스텀 로고가 올바르게 렌더링되는지 확인
    const customLogo = screen.getByText("My Custom Logo")
    expect(customLogo).toBeInTheDocument()

    // GNB 컨테이너가 존재하는지 확인 (flex items-center gap-4)
    const gnbContainer = screen.getByRole("group", { name: /custom gnb/i })
    expect(gnbContainer).toBeInTheDocument()

    // GNB 내부에 메뉴 버튼 2개, Divider, 버튼이 있는지 확인
    const homeMenuButtons = screen.getAllByRole("button", { name: /home/i })
    expect(homeMenuButtons.length).toBe(2)

    // Divider는 별도의 role이 없으므로 class로 확인
    const divider = screen.getAllByRole("separator", { hidden: true })
    expect(divider.length).toBe(1)

    // Login 버튼 확인
    const loginButton = screen.getByRole("button", { name: /login/i })
    expect(loginButton).toBeInTheDocument()
  })

  describe("GNB와 Utility 기능 테스트", () => {
    test("gnb prop으로 전달된 아이템들이 올바르게 렌더링되어야 한다.", () => {
      render(<WithGNBAndUtility />)

      // GNB 컨테이너가 존재하는지 확인
      const gnbContainer = screen.getByTestId("header-gnb")
      expect(gnbContainer).toBeInTheDocument()

      // Tenant 버튼이 렌더링되는지 확인
      const tenantButton = screen.getByRole("button", { name: /Memory/i })
      expect(tenantButton).toBeInTheDocument()

      // 메뉴 버튼들이 렌더링되는지 확인
      const docsMenu = screen.getByRole("button", { name: /문서/i })
      const guideMenu = screen.getByRole("button", { name: /가이드/i })
      expect(docsMenu).toBeInTheDocument()
      expect(guideMenu).toBeInTheDocument()
    })

    test("utility prop으로 전달된 아이템들이 올바르게 렌더링되어야 한다.", () => {
      render(<WithGNBAndUtility />)

      // Utility 컨테이너가 존재하는지 확인
      const utilityContainer = screen.getByTestId("header-utility")
      expect(utilityContainer).toBeInTheDocument()
      expect(utilityContainer).toHaveStyle("margin-left: auto")

      // 알림 버튼이 data-noti-count 속성을 가지는지 확인
      const notificationButton = screen.getByRole("button", { name: /알림/i })
      expect(notificationButton).toBeInTheDocument()
      expect(notificationButton).toHaveAttribute("data-noti-count", "3")

      // 업데이트 버튼이 data-badge 속성을 가지는지 확인
      const updateButton = screen.getByRole("button", { name: /업데이트/i })
      expect(updateButton).toBeInTheDocument()
      expect(updateButton).toHaveAttribute("data-badge", "true")

      // 햄버거 메뉴가 렌더링되는지 확인
      const hamburgerMenu = screen.getByTestId("header-hamburger-menu")
      expect(hamburgerMenu).toBeInTheDocument()
    })

    test("커스텀 레이아웃에서 Header.GNB와 Header.Utility 컨테이너가 올바르게 동작해야 한다.", () => {
      render(<CustomLayoutWithGNBUtility />)

      // GNB 컨테이너 확인
      const gnbContainer = screen.getByTestId("header-gnb")
      expect(gnbContainer).toBeInTheDocument()

      // Utility 컨테이너 확인
      const utilityContainer = screen.getByTestId("header-utility")
      expect(utilityContainer).toBeInTheDocument()
      expect(utilityContainer).toHaveStyle("margin-left: auto")

      // 컨테이너 내부 요소들 확인
      const homeMenu = screen.getByRole("button", { name: /Memory/i })
      const docsMenu = screen.getByRole("button", { name: /문서/i })
      expect(homeMenu).toBeInTheDocument()
      expect(docsMenu).toBeInTheDocument()
    })

    test("Header.HamburgerMenu 컴포넌트가 올바르게 렌더링되어야 한다.", () => {
      render(<HamburgerMenu />)

      // 햄버거 메뉴 버튼이 존재하는지 확인
      const hamburgerButton = screen.getByTestId("header-hamburger-menu")
      expect(hamburgerButton).toBeInTheDocument()
      expect(hamburgerButton).toHaveAttribute("type", "button")

      // 햄버거 아이콘이 있는지 확인 (3개의 선)
      const hamburgerIcon = screen.getByTestId("hamburger-icon")
      expect(hamburgerIcon).toBeInTheDocument()
    })

    test("HeaderItem에 tenant와 hamburger 타입이 올바르게 처리되어야 한다.", () => {
      render(<WithGNBAndUtility />)

      // tenant 타입 버튼 확인
      const tenantButton = screen.getByRole("button", { name: /Memory/i })
      expect(tenantButton).toBeInTheDocument()
      expect(tenantButton).toHaveClass("header-tenant")

      // hamburger 타입 버튼 확인
      const hamburgerButton = screen.getByTestId("header-hamburger-menu")
      expect(hamburgerButton).toBeInTheDocument()
      expect(hamburgerButton).toHaveClass("header-hamburger")
    })
  })
})

describe("Header.Menu DropdownMenu 기반 개선", () => {
  test("Header.Menu는 items prop으로 DropdownMenu를 렌더링한다", async () => {
    render(<MenuWithItems />)
    const trigger = screen.getByRole("button", { name: /menu trigger/i })
    expect(trigger).toBeInTheDocument()
    await userEvent.click(trigger)
    expect(screen.getByRole("menuitem", { name: /Menu1/i })).toBeInTheDocument()
    expect(screen.getByRole("menuitem", { name: /Menu2/i })).toBeInTheDocument()
  })

  test("Header.Menu의 메뉴 항목 클릭 시 onSelect 콜백이 호출된다", async () => {
    const onSelect = vi.fn()
    // gnb의 menu 아이템에 onSelect를 주입
    const args = JSON.parse(JSON.stringify(MenuWithItems.args))
    args.gnb[0].onSelect = onSelect
    render(<MenuWithItems {...args} />)
    const trigger = screen.getByRole("button", { name: /menu trigger/i })
    await userEvent.click(trigger)
    const menuItem = screen.getByRole("menuitem", { name: /Menu2/i })
    await userEvent.click(menuItem)
    expect(onSelect).toHaveBeenCalledWith("menu2")
  })

  test("Header.Menu의 value/selected/disabled prop이 정상 동작한다", async () => {
    // gnb의 menu 아이템에 selected, disabled 값 주입
    const args = JSON.parse(JSON.stringify(MenuWithItems.args))
    args.gnb[0].selected = "menu2"
    args.gnb[0].items[2].disabled = true
    render(<MenuWithItems {...args} />)
    await userEvent.click(screen.getByRole("button", { name: /menu trigger/i }))
    const selectedItem = screen.getByRole("menuitem", { name: /Menu2/i })
    expect(selectedItem).toHaveAttribute("aria-selected", "true")
    const disabledItem = screen.getByRole("menuitem", { name: /Menu3/i })
    expect(disabledItem).toHaveAttribute("aria-disabled", "true")
  })

  test("Header.Menu DropdownMenu 인터랙션", async () => {
    const { container } = render(<MenuWithItems />)
    await MenuWithItems.play!({ canvasElement: container })
  })
})
