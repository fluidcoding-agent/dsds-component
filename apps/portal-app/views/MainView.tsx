"use client";

import { Footer, NavBar } from "@dsds/react-radix-ui";
import { LucideComponent } from "lucide-react";
import { TabContent } from "./_components/TabContent";

export default function MainView() {
  return (
    <div className="layout flex h-screen w-screen flex-col overflow-hidden">
      <header className="border-b-1 border-b-[#e9edf0] min-h-[3.125rem]">
        <NavBar title="DSDS Portal" icon={<LucideComponent />} />
      </header>
      <main className="flex-1 overflow-y-auto border-b-gray-200 bg-[#edf2f4]">
        <div className="mesportal-container-fluid mr-auto ml-auto w-[1444px] min-w-[1444px] pl-3">
          <div className="mesportal-contain flex border-b-1 border-b-[#ccd1d6] text-start">
            <div className="container-left mr-10 flex-1">
              <h2 className="mt-16 leading-9 text-[36px] font-bold font-sans">
                DS 컴포넌트를 한 곳에서, 한번에
              </h2>
              <div className="sub-txt text-mp-gray mt-3 mb-8 text-[14px] leading-5">
                DS 표준 디자인 시스템을 준수하는 MES 표준 UI 컴포넌트와 자주
                사용되는 레이아웃을
                <br />
                주요 모던 웹 프레임워크(React, Vue)용으로 구현하여, 설치가능한
                패키지로 제공합니다.
              </div>
              {/*<ButtonDemo /> */}
              <section className="content-tabs">
                <div className="btn-wrap border-b-mp-title-bggray flex justify-between border-b-1 pb-2">
                  {/* <TabButtonGroup className="btn-group-left" /> */}
                  <TabContent />
                </div>
              </section>
              <section className="content-main mt-2">
                <ul className="content-list flex">
                  {/* <Card
                    title="Vue"
                    description="Vuetify, Headless-UI 로 구현된 UI 컴포넌트입니다."
                  /> */}
                </ul>
              </section>
            </div>
            <div className="container-right mt-20">
              <div className="card w-[340px]">최근 방문 메뉴</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
