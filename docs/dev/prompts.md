# 자주 쓰는 프롬프트들.

## TailwindCSS 리팩토링 하기

```
Refactor one-line-huge tailwindcss classnames in the entire file to be grouped by alike ones, but AS COMPACT AS possible.
```

## 컨텍스트 만들기

```
codeweaver -ignore="favicon.ico,assets/images,assets/fonts,node_modules,storybook-static,.git.*,pnpm-lock.yaml,project_docs.md,.next,dist,build,.DS_Store,.*-snapshots" -output=~/downloads/project_docs.md
```

```
codeweaver -ignore="public,favicon.ico,__snapshots__,.*.(lock|lockb|png|ico|jpg|jpeg|ttf|otf|woff|woff2)$,node_modules,storybook-static,.git.*,pnpm-lock.yaml,project_docs.md,.next,dist,build,.DS_Store,.*-snapshots" -output=$HOME/downloads/shadcn-ui-repo.md
```

##

> Vuetify 를 커스터마이징하여 @dsds/vue-vuetify 라이브러리로 제공하려 합니다. 디자인 시스템가이드를 충실히 만족하는 표준 구현은 @dsds/react-radix-ui 로 만들어 놓았습니다. 이제 Radix-ui 에서 tailwindcss v4 를 기반으로 구현한 디자인을 Vuetify 에 css 편집하여 최대한 Look and Feel 을 맞추려 합니다. tailwindcss v4로 구축된 design/generated/index.css 를 Source of Truth 로 하여 css raw variable 이 아닌 시맨틱 토큰과 유틸리티 클래스를 최대한 재사용해보고자 합니다. 어떻게 진행하면 좋을까요?
>
> (Context: vbtn.css, VBtn.vue, VBtn.stories.ts, button.css, Buttons.stories.tsx, Button.tsx, vuetify/package.json, radix-ui/package.json, Onboarding.mdx, design-system-guide.md, design)