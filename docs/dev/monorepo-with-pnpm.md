# 모노레포에서 `pnpm` 사용하기

- 참고: [PNPM으로-모노레포-구축하기](https://velog.io/@yoosion030/PNPM%EC%9C%BC%EB%A1%9C-%EB%AA%A8%EB%85%B8%EB%A0%88%ED%8F%AC-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0)

이 프로젝트는 `pnpm` 로 모노레포가 구성되어있습니다.

루트 디렉토리에 있는 `package.json` 파일을 통해 모노레포를 관리합니다.

```
- package.json
```

## 기본 커맨드

`/package.json` 에는 다음 명령이 포함되어있습니다.

- `radix-ui` : `pnpm --filter @dsds/react-radix-ui`
- `vuetify` : `pnpm --filter @dsds/vue-vuetify`

## 모노레포 전역 패키지 설치

```
pnpm add <설치할 패키지> -w
```

## 특정 하위 레포에 패키지 설치하기

1. 루트 폴더에서

```
pnpm add <설치할 패키지> --filter <하위 레포 이름>
```

또는 `portal-app`, `vuetify`, `radix-ui` 등으로 바로 접근 가능합니다.

예)

```
    pnpm portal-app add <설치할 패키지>
```

2. 하위 레포 폴더에서

```
pnpm add <설치할 패키지>
```

## 워크스페이스 내 다른 패키지 의존성 추가하기

```
pnpm add <설치할 패키지> --filter <하위 레포 이름> -w
```

