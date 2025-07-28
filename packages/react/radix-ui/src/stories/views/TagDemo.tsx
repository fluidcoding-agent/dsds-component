import { DummyIcon } from "@/components/icons"
import { Tag } from "@/components/ui"

import { DemoRowTitle } from "./_components/DemoRowTitle"

export function TagDemo() {
  return (
    <div className="flex flex-row items-center gap-[60px]">
      <div className="flex flex-col items-start gap-[4px]">
        <DemoRowTitle title="Enabled" />

        <Tag title="Tag" />
        <Tag title="Tag" round />
        <Tag title="Tag" closeIcon />
        <Tag title="Tag" round closeIcon />
        <div className="h-[12px]" />
        <Tag icon={<DummyIcon />} title="Tag" />
        <Tag icon={<DummyIcon />} title="Tag" round />
        <Tag icon={<DummyIcon />} title="Tag" closeIcon />
        <Tag icon={<DummyIcon />} title="Tag" round closeIcon />
        <div className="h-[12px]" />
        <Tag hashtag title="Tag" />
        <Tag hashtag title="Tag" round />
        <Tag hashtag title="Tag" closeIcon />
        <Tag hashtag title="Tag" round closeIcon />
      </div>
      <div className="flex flex-col items-start gap-[4px]">
        <DemoRowTitle title="Disabled" />

        <Tag disabled title="Tag" />
        <Tag disabled title="Tag" round />
        <Tag disabled title="Tag" closeIcon />
        <Tag disabled title="Tag" round closeIcon />
        <div className="h-[12px]" />
        <Tag icon={<DummyIcon />} disabled title="Tag" />
        <Tag icon={<DummyIcon />} disabled title="Tag" round />
        <Tag icon={<DummyIcon />} disabled title="Tag" closeIcon />
        <Tag icon={<DummyIcon />} disabled title="Tag" round closeIcon />
        <div className="h-[12px]" />
        <Tag hashtag disabled title="Tag" />
        <Tag hashtag disabled title="Tag" round />
        <Tag hashtag disabled title="Tag" closeIcon />
        <Tag hashtag disabled title="Tag" round closeIcon />
      </div>
    </div>
  )
}
