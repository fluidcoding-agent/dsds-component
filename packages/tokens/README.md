# DSDS / Tokens

Figma 디자인 토큰 기반으로 자동빌드되는 공통 CSS 파일, 이미지, 아이콘등을 패키지화 했습니다.

- 스토리북: https://dsds.mwebdev.samsungds.net/storybooks/tokens

## 참고: Figma 디자인 토큰 자동빌드 방법

- Figma 에서 사용하는 Styles 과 Variables 를 Tokens Studio 플러그인으로 Import 후을 사내 Github의 `design/tokens.json` 으로 Push 합니다.
- Github Actions 의 CI/CD 스크립트가 실행됩니다.
  1. `design/tokens.json` 파일을 `global.css`, `light.css` 로 transform 후
  2. 관련 CSS 변경사항이 있을 경우 빌드된 CSS 파일까지 자동 Commit 합니다.
- 변경된 CSS를 반영한 Storybook을 자동 빌드 배포됩니다.
