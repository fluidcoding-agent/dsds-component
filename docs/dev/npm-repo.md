# NPM Repository 관리

## Private Repository 서버: Verdaccio

- 모던웹서버(`mwebdev`) 에 떠있습니다.
- 계정은 /project/mwebdev/.htpasswd 에 저장됩니다.
  - 계정 `dsds`, 패스워드는 김용기님<yongki82.kim@samsung.com> 에 문의
- 로그인 하기: `pnpm login --registry=https://npm.mwebdev.samsungds.net`
- 배포방법: 각 프로젝트의 `scripts/publish.sh` 스크립트를 참고하세요.

