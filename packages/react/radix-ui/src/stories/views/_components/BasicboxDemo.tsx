import { cn } from "@/lib/utils"
import { Basicbox as BasicBoxPrimitive, type BasicboxProps } from "@/components/ui/boxes"
import { CloseIcon, DummyIcon } from "@/components/icons"

import { DemoRow } from "./DemoRow"
import { DemoRowItem } from "./DemoRowItem"
import { DemoRowTitle } from "./DemoRowTitle"

const Basicbox = (args: BasicboxProps) => {
  return (
    <BasicBoxPrimitive
      {...args}
      width={args.iconOnly ? undefined : 85}
      wrapperClassName={
        args.iconOnly ? undefined : cn("border-basic-box-demo px-[6px]", args.icon && "pr-[4px]", args.wrapperClassName)
      }
    />
  )
}

export function BasicboxDemo() {
  const defaultBasicboxProps = {
    placeholder: "Boxes",
    icon: <DummyIcon />,
  }

  return (
    <ul className="flex flex-col gap-5 [&:first-child>li:nth-child(2)>label]:mt-[25px]">
      <DemoRowTitle title="Basicbox" />
      <DemoRow title="Default">
        <DemoRowItem label="No Icons">
          <Basicbox placeholder={defaultBasicboxProps.placeholder} />
        </DemoRowItem>
        <DemoRowItem label="With Icons" className="flex flex-col">
          <Basicbox {...defaultBasicboxProps} />
          <Basicbox {...defaultBasicboxProps} iconSub={<CloseIcon />} />
        </DemoRowItem>
        <DemoRowItem label="Icons & Message">
          <Basicbox {...defaultBasicboxProps} message="Text(Optional)" width={85} iconSub={<CloseIcon />} />
          <Basicbox
            {...defaultBasicboxProps}
            message="Text(Optional)"
            messageType="emphasis"
            width={85}
            iconSub={<CloseIcon />}
          />
          <Basicbox
            {...defaultBasicboxProps}
            message="Text(Optional)"
            messageType="danger"
            width={85}
            iconSub={<CloseIcon />}
          />
        </DemoRowItem>
        <DemoRowItem label="Multi-line Message">
          <Basicbox {...defaultBasicboxProps} message="Text(Optional) Multi-line message" iconSub={<CloseIcon />} />
        </DemoRowItem>
      </DemoRow>
    </ul>
  )
}
