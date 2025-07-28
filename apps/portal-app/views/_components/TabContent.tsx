"use client";

import { Searchbox, Button } from "@dsds/react-radix-ui";

export function TabContent() {
  return (
    <div className="flex flex-col gap-4">
      {
        <Searchbox
          className="right-search-group w-[220px]"
          placeholder="원하는 시스템을 검색해보세요"
        />
      }
      <Button>검색</Button>
    </div>
  );
}
