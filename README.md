# DSDS Monorepo

DSDS 포탈 및 컴포넌트 라이브러리 저장소입니다.
- 임시 DSDS 포탈 : https://dsds.mwebdev.samsungds.net (SMAP 이전 예정)
- 임시 사내 npm 레포 : https://npm.mwebdev.samsungds.net (SMAP 이전 예정)

## 사전 준비

- Node.js v20 추천.
- `pnpm` 설치
    ```
    npm install -g pnpm@latest-10
    ```
- `$HOME/.npmrc` 파일에 아래 내용을 **꼭** 추가해주세요. (pnpm 사용시 문제 해결)
    ```
    shamefully-hoist=true
    strict-peer-dependencies=false
    ```

## 프로젝트 구조

```
dsds/
|
+- design/tokens.json  : 디자인 토큰 정의 파일 (업데이트시 css로 자동 빌드)
|  +-- generated/{css, tokens}
|
+- packages
|  |
|  +-- tokens/         : @dsds/tokens           (storybook 포함)
|  |
|  +--- react/
|  |   +
|  |   +-- radix-ui    : @dsds/react-radix-ui    (storybook 포함)
|  |
|--+-- vue/
|      +
|      +-- vuefity     : @dsds/vue-vuetify       (storybook 포함)
|      +-- radix-vue   : @dsds/vue-radix-vue     (TODO)
|
+- apps/
|  +-- portal-app      : 포탈 앱 프로젝트        (Next.js)
|
+--- storybooks/ (TODO)
   +-- pemsr   (TODO)

```

## 참고

**도움말**

- [모노레포에서 pnpm 사용하기](./docs/monorepo-with-pnpm.md)

**왜 `pnpm` 을 사용하나요?**

1. npm에 비해 2~3배 이상 빠릅니다. (2025년 4월 기준)
2. **디스크 크게 절약**: 하드/심볼릭 링크를 사용해 중복 다운로드 없이 전역 저장소에서 패키지를 참조합니다.
   - 예: 50개 프로젝트가 같은 패키지를 쓸 때 npm은 50번 저장하지만 pnpm은 한 번만 저장
3. 대규모 모노레포를 자체적으로 지원하여 여러 패키지를 효율적으로 관리할 수 있습니다.
