import { useState } from "react"

import { Lnb, LNBInputItem } from "@/components/ui/Lnb"
import { LnbUnionIcon } from "@/components/icons/LnbIcon"
import { Searchbox, Tabs, TabsList, TabsTrigger, Tag } from "@/components/ui"

import { DemoRowTitle } from "./_components/DemoRowTitle"

const fdcSample: LNBInputItem = {
  title: <Searchbox value={"메뉴명 검색"} />,
  items: [
    {
      id: "1",
      content: "즐겨찾기",
      items: [],
    },
    {
      id: "2",
      content: "FDC View",
      items: [],
    },
    {
      id: "3",
      content: "EPT",
      items: [],
    },
    {
      id: "4",
      content: "Interlock",
      items: [
        {
          type: "item",

          id: "4-1",
          content: "Lot List(ERD/TSUM)(Modeling)(Lightning)",
        },
        {
          type: "item",
          id: "4-2",
          content: "Fault Summary",
        },
        {
          type: "item",
          id: "4-3",
          content: "Interlock Summary",
        },
        {
          type: "item",
          id: "4-4",
          content: "Fault Summary(Multi)",
        },
        {
          type: "item",
          id: "4-5",
          content: "Interlock Summary(Multi)",
        },
      ],
    },

    {
      id: "5",
      content: "Preference",
      items: [
        {
          id: "50",
          content: "물류설비",
          items: [
            {
              type: "item",
              id: "5-1-1",
              content: "Tool(General)",
            },
            {
              type: "item",
              id: "5-1-2",
              content: "MDM Tool(General)",
            },
            {
              type: "item",
              id: "5-1-3",
              content: "Lot Filter Info(General)",
            },
            {
              type: "item",
              selected: true,
              id: "5-1-4",
              content: "Stricke Out Lot Filter(General)",
            },
          ],
        },
        {
          id: "5-2",
          content: "Tool",
          items: [],
        },
        {
          id: "5-3",
          content: "PM Reg",
          items: [],
        },
        {
          id: "5-4",
          content: "Alarm",
          items: [],
        },
        {
          id: "5-5",
          content: "MCC Spec",
          items: [],
        },
        {
          id: "5-6",
          content: "DCP",
          items: [],
        },
        {
          id: "5-7",
          content: "SPEC Reg",
          items: [],
        },
      ],
    },
    {
      id: "6",
      content: "EDA",
      items: [
        {
          id: "6-1",
          content: "물류설비",
          items: [
            {
              type: "item",
              id: "6-1-1",
              content: "Tool(General)",
            },
          ],
        },
      ],
    },
    {
      id: "7",
      content: "Report",
      items: [],
    },
    {
      id: "8",
      content: "ARG",
      items: [],
    },
    {
      id: "9",
      content: "FPA",
      items: [],
    },
  ],
}

const mosSample: LNBInputItem = {
  title: "Equipment",
  items: [
    {
      type: "item",
      id: "1",
      selected: true,
      content: "설비 Master",
    },
    {
      type: "item",
      id: "2",
      content: "N2 설비 상태 조회",
    },
    {
      type: "item",
      id: "3",
      content: "이상 설비 Lot Hold",
    },
    {
      type: "item",
      id: "4",
      content: "EARS 연동 설비 제어",
    },
  ],
}

const especSample: LNBInputItem = {
  title: "업무함",
  items: [
    {
      id: "1",
      content: "작성중",
      items: [],
    },
    {
      id: "2",
      content: "미결함",
      items: [],
    },
    {
      id: "3",
      content: "상신함",
      items: [],
    },
    {
      id: "4",
      content: "MSS(EDSS)",
      items: [
        {
          id: "4-1",
          content: "Reporting",
          items: [
            {
              type: "item",
              id: "4-1-1",
              content: "Change Report",
            },
          ],
        },
        {
          id: "4-2",
          content: "Analysis",
          items: [
            {
              type: "item",
              id: "4-2-1",
              content: "Change Report",
            },
            {
              type: "item",
              id: "4-2-2",
              content: "Manual Change",
            },
            {
              type: "item",
              id: "4-2-3",
              selected: true,
              content: "요청서 이력관리",
            },
            {
              type: "item",
              id: "4-2-4",
              content: "Hourus Limit 조정",
            },
            {
              type: "item",
              id: "4-2-5",
              content: "SSM 기본 Para 조정",
            },
          ],
        },
        {
          id: "4-3",
          content: "Wafer Segister",
          items: [
            {
              type: "item",
              id: "4-3-1",
              content: "eSpec",
            },
          ],
        },
      ],
    },
  ],
}

const tabItems = ["전체 메뉴", "나의 메뉴"]

const gpmSample: LNBInputItem = {
  title: (
    <Tabs defaultValue="전체 메뉴">
      <TabsList>
        {tabItems.map((title, i) => (
          <TabsTrigger key={i} value={title}>
            <div>{title}</div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  ),
  items: [
    {
      id: "1",
      content: "즐겨찾기",
      items: [],
    },
    {
      id: "2",
      content: "업무함",
      items: [],
    },
    {
      id: "3",
      content: "제조 기준정보",
      items: [],
    },
    {
      id: "4",
      content: "설비 기준정보",
      items: [
        {
          id: "4-1",
          content: "제조설비",
          items: [],
        },
        {
          id: "4-2",
          content: "물류설비",
          items: [
            {
              id: "4-2-1",
              content: "AMHS STK_ID",
            },
            {
              id: "4-2-2",
              selected: true,
              content: "AMHS STG_GROUP_PLD",
            },
            {
              id: "4-2-3",
              content: "AMHS STG_HOLDLOT_STK",
            },
            {
              id: "4-2-4",
              content: "AMHS.FOUP_CHG_ASSIGN_STK",
            },
            {
              id: "4-2-5",
              content: "AMHS EXTENSION",
            },
            {
              id: "4-2-6",
              content: "AMHS NRFC_ID",
            },
            {
              id: "4-2-7",
              content: "CMCS PARAMETER",
            },
          ],
        },
        {
          id: "4-3",
          content: "분석설비",
          items: [],
        },
      ],
    },
    {
      id: "5",
      content: "원부자재 기준정보",
      items: [],
    },
    {
      id: "6",
      content: "일반 기준정보",
      items: [],
    },
    {
      id: "7",
      content: "APC 기준정보",
      items: [],
    },
    {
      id: "8",
      content: "타 시스템 자동발의 메뉴",
      items: [],
    },
  ],
}

const lnbSample: LNBInputItem = {
  icon: <LnbUnionIcon />,
  title: "LNB Header Title",
  items: [
    {
      id: "1",
      content: "대그룹 아코디언(Accordion)",
      items: [
        {
          id: "1-1",
          content: "중그룹 트리(Tree)",
          items: [
            {
              type: "item",
              id: "1-1-1",
              content: "항목(Item)",
            },
            {
              type: "item",
              id: "1-1-2",
              content: "항목(Item)",
            },
          ],
        },
        {
          id: "1-2",
          content: "중그룹 트리(Tree)",
          items: [
            {
              id: "1-2-1",
              content: "중그룹 트리(Tree)",
              items: [
                {
                  id: "1-2-1-1",
                  content: "중그룹 트리(Tree)",
                  items: [
                    {
                      type: "item",
                      id: "1-2-1-1-1",
                      content: "항목(Item)",
                    },
                    {
                      type: "item",
                      id: "1-2-1-1-2",
                      content: "항목(Item)",
                      selected: true,
                    },
                    {
                      type: "item",
                      id: "1-2-1-1-3",
                      content: "항목(Item)",
                      disabled: true,
                    },
                  ],
                },
                {
                  id: "1-2-1-2",
                  content: "중그룹 트리(Tree)",
                  items: [
                    {
                      type: "item",
                      id: "1-2-1-2-1",
                      content: "항목(Item)",
                    },
                    {
                      type: "item",
                      id: "1-2-1-2-2",
                      content: "항목(Item)",
                    },
                    {
                      type: "item",
                      id: "1-2-1-2-3",
                      content: "항목(Item)",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const lnbWithoutAccordionSample: LNBInputItem = {
  icon: <LnbUnionIcon />,
  title: "LNB Header Title",
  items: [
    {
      id: "1",
      content: "중그룹 트리(Tree)",
      items: [
        {
          id: "1-1",
          content: "중그룹 트리(Tree)",
          items: [
            {
              type: "item",
              id: "1-1-1",
              content: "항목(Item)",
            },
            {
              type: "item",
              id: "1-1-2",
              content: "항목(Item)",
            },
          ],
        },
        {
          id: "1-2",
          content: "중그룹 트리(Tree)",
          items: [
            {
              id: "1-2-1",
              content: "중그룹 트리(Tree)",
              items: [
                {
                  id: "1-2-1-1",
                  content: "중그룹 트리(Tree)",
                  items: [
                    {
                      type: "item",
                      id: "1-2-1-1-1",
                      content: "항목(Item)",
                    },
                    {
                      type: "item",
                      id: "1-2-1-1-2",
                      content: "항목(Item)",
                      selected: true,
                    },
                    {
                      type: "item",
                      id: "1-2-1-1-3",
                      content: "항목(Item)",
                      disabled: true,
                    },
                  ],
                },
                {
                  id: "1-2-1-2",
                  content: "중그룹 트리(Tree)",
                  items: [
                    {
                      type: "item",
                      id: "1-2-1-2-1",
                      content: "항목(Item)",
                    },
                    {
                      type: "item",
                      id: "1-2-1-2-2",
                      content: "항목(Item)",
                    },
                    {
                      type: "item",
                      id: "1-2-1-2-3",
                      content: "항목(Item)",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const selectSample: LNBInputItem = {
  title: "Select Item Test",
  items: [
    {
      id: "1",
      content: "즐겨찾기",
      items: [],
    },
    {
      id: "2",
      content: "업무함",
      items: [],
    },
    {
      id: "3",
      content: "제조 기준정보",
      items: [],
    },
    {
      id: "4",
      content: "설비 기준정보",
      items: [
        {
          id: "4-1",
          content: "제조설비",
          items: [],
        },
        {
          id: "4-2",
          content: "물류설비",
          items: [
            {
              id: "4-2-1",
              content: "AMHS STK_ID",
            },
            {
              id: "4-2-2",
              selected: true,
              content: "AMHS STG_GROUP_PLD",
            },
            {
              id: "4-2-3",
              content: "AMHS STG_HOLDLOT_STK",
            },
            {
              id: "4-2-4",
              content: "AMHS.FOUP_CHG_ASSIGN_STK",
            },
            {
              id: "4-2-5",
              content: "AMHS EXTENSION",
            },
            {
              id: "4-2-6",
              content: "AMHS NRFC_ID",
            },
            {
              id: "4-2-7",
              content: "CMCS PARAMETER",
            },
          ],
        },
        {
          id: "4-3",
          content: "분석설비",
          items: [],
        },
      ],
    },
    {
      id: "5",
      content: "원부자재 기준정보",
      items: [],
    },
    {
      id: "6",
      content: "일반 기준정보",
      items: [],
    },
    {
      id: "7",
      content: "APC 기준정보",
      items: [],
    },
    {
      id: "8",
      content: "타 시스템 자동발의 메뉴",
      items: [],
    },
  ],
}

export function LnbDemo() {
  const [selectedItemId, setChildValue] = useState<string>("")
  console.log(selectedItemId)

  // 자식으로 내려줄 콜백: selectedItemId를 인자로 받아서 state에 저장
  const handleSelectedId = (value: string) => {
    setChildValue(value)
  }
  return (
    <div>
      <DemoRowTitle title="예제" />
      <div className="flex flex-row gap-8 pb-10">
        <div>
          <h3>FDC</h3>
          <Lnb data={fdcSample} />
        </div>
        <div>
          <h3>MOS O/I</h3>
          <Lnb data={mosSample} />
        </div>
        <div>
          <h3>eSpec</h3>
          <Lnb data={especSample} />
        </div>
        <div>
          <h3>GPM</h3>
          <Lnb data={gpmSample} />
        </div>
      </div>

      <DemoRowTitle title="구성" />
      <div className="flex flex-row gap-8 pb-10">
        <div>
          <h3>With Accordion</h3>
          <Lnb data={lnbSample} />
        </div>
        <div>
          <h3>Without Accordion</h3>
          <Lnb data={lnbWithoutAccordionSample} withoutAccordion />
        </div>
        <div className="flex flex-row gap-8">
          <div>
            <h3>Selected Item Test</h3>
            <Lnb data={selectSample} onValueChange={handleSelectedId} />
          </div>
          <div className="flex flex-col">
            <div className="pt-[30px]">
              selectedItemId: <Tag title={selectedItemId} />
            </div>
            <div className="pt-[15px]">왼쪽 LNB에서 항목 선택 시</div>
            <div className="">아이디를 확인할 수 있습니다.</div>
          </div>
        </div>
      </div>

      <DemoRowTitle title="구성" />
      <div className="flex flex-row gap-8">
        <div>
          <h3>Hide</h3>
          <Lnb data={lnbSample} hide={true} />
        </div>
      </div>
    </div>
  )
}
