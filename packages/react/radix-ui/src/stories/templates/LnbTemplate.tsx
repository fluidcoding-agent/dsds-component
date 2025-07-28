import { Lnb, LNBInputItem } from "@/components/ui/Lnb"
import { LnbUnionIcon } from "@/components/icons/LnbIcon"

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
              ],
            },
          ],
        },
      ],
    },
  ],
}

export function LnbTemplate() {
  return <Lnb data={lnbSample} />
}
