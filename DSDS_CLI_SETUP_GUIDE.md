# DSDS CLI 도구 제작 가이드

shadcn/ui 스타일의 커스텀 UI 컴포넌트 라이브러리를 CLI 도구로 배포하는 완전한 가이드입니다.

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [CLI 도구 구조 설계](#cli-도구-구조-설계)
3. [단계별 구현](#단계별-구현)
4. [자동화 설정](#자동화-설정)
5. [배포 및 사용법](#배포-및-사용법)
6. [유지보수](#유지보수)

## 🎯 프로젝트 개요

### 목표
- 기존 shadcn/ui 스타일의 커스텀 컴포넌트들을 CLI 도구로 배포
- `npx dsds add button` 형태로 컴포넌트를 프로젝트에 추가 가능
- 컴포넌트 업데이트 시 자동으로 CLI에 반영

### 요구사항
- Node.js 18+
- TypeScript
- Commander.js (CLI 프레임워크)
- 기존 컴포넌트 라이브러리

## 🏗️ CLI 도구 구조 설계

```
packages/dsds-cli/
├── src/
│   ├── commands/
│   │   ├── init.ts      # 프로젝트 초기화
│   │   ├── add.ts       # 컴포넌트 추가
│   │   └── list.ts      # 컴포넌트 목록
│   ├── utils/
│   │   ├── config.ts    # 설정 관리
│   │   ├── registry.ts  # 컴포넌트 레지스트리
│   │   └── transform.ts # 코드 변환
│   └── index.ts         # CLI 진입점
├── components/          # 컴포넌트 파일들
├── scripts/
│   └── sync-components.js # 컴포넌트 동기화
├── .github/workflows/
│   └── publish.yml      # 자동 배포
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 단계별 구현

### 1단계: 기본 CLI 구조 생성

#### package.json 설정
```json
{
  "name": "dsds",
  "version": "1.0.0",
  "description": "A CLI tool for adding UI components to your project",
  "main": "dist/index.js",
  "bin": {
    "dsds": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "sync": "node scripts/sync-components.js",
    "prebuild": "npm run sync",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    "commander": "^11.0.0",
    "chalk": "^4.1.2",
    "ora": "^5.4.1",
    "prompts": "^2.4.2",
    "fs-extra": "^11.1.1",
    "node-fetch": "^2.7.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/fs-extra": "^11.0.1",
    "@types/prompts": "^2.4.4",
    "typescript": "^5.0.0"
  }
}
```

#### TypeScript 설정 (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2단계: CLI 진입점 구현

#### src/index.ts
```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import { addCommand } from './commands/add';
import { initCommand } from './commands/init';
import { listCommand } from './commands/list';

const program = new Command();

program
  .name('dsds')
  .description('CLI tool for adding UI components to your project')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize dsds in your project')
  .action(initCommand);

program
  .command('add')
  .description('Add components to your project')
  .argument('[components...]', 'components to add')
  .action(addCommand);

program
  .command('list')
  .description('List all available components')
  .action(listCommand);

program.parse();
```

### 3단계: 핵심 명령어 구현

#### init 명령어 (src/commands/init.ts)
```typescript
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';

export async function initCommand() {
  console.log(chalk.blue('🚀 Initializing dsds in your project...'));

  const cwd = process.cwd();
  const configPath = path.join(cwd, 'components.json');

  // 설정 파일 생성 로직
  const config = await prompts([
    {
      type: 'select',
      name: 'style',
      message: 'Which style would you like to use?',
      choices: [
        { title: 'New York', value: 'new-york' },
        { title: 'Default', value: 'default' },
      ],
    },
    // ... 기타 설정 옵션들
  ]);

  // components.json 파일 생성
  const componentConfig = {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: config.style,
    // ... 기타 설정
  };

  await fs.writeJson(configPath, componentConfig, { spaces: 2 });
  console.log(chalk.green('✅ dsds initialized successfully!'));
}
```

#### add 명령어 (src/commands/add.ts)
```typescript
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getComponentRegistry } from '../utils/registry';
import { getConfig } from '../utils/config';
import { transformImports } from '../utils/transform';

export async function addCommand(components: string[]) {
  const cwd = process.cwd();
  const config = await getConfig(cwd);
  
  if (!config) {
    console.log(chalk.red('❌ components.json not found. Run `dsds init` first.'));
    return;
  }

  const registry = await getComponentRegistry();
  const spinner = ora('Adding components...').start();

  for (const componentName of components) {
    const component = registry[componentName.toLowerCase()];
    
    if (!component) {
      spinner.fail(chalk.red(`Component "${componentName}" not found.`));
      continue;
    }

    // 컴포넌트 파일 생성
    const componentPath = path.join(
      cwd,
      config.aliases.ui.replace('@/', ''),
      `${component.name}.tsx`
    );

    await fs.ensureDir(path.dirname(componentPath));
    const transformedContent = transformImports(component.content, config);
    await fs.writeFile(componentPath, transformedContent);
    
    spinner.succeed(chalk.green(`Added ${component.name}`));
  }
}
```

### 4단계: 컴포넌트 레지스트리 구현

#### src/utils/registry.ts
```typescript
import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';

// GitHub에서 실시간으로 컴포넌트 가져오기
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/packages/react/radix-ui/src/components/ui';

export async function getComponentRegistry(): Promise<Registry> {
  try {
    // GitHub에서 최신 컴포넌트 가져오기
    const componentsFromGitHub = await fetchComponentsFromGitHub();
    if (Object.keys(componentsFromGitHub).length > 0) {
      return componentsFromGitHub;
    }
    
    // 로컬 컴포넌트로 폴백
    return await getLocalComponents();
  } catch (error) {
    console.error('Failed to load component registry:', error);
    return await getLocalComponents();
  }
}

async function fetchComponentsFromGitHub(): Promise<Registry> {
  const registry: Registry = {};
  const componentList = ['Button.tsx', 'Card.tsx', 'Badge.tsx', /* ... */];
  
  for (const fileName of componentList) {
    try {
      const url = `${GITHUB_RAW_BASE}/${fileName}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const content = await response.text();
        const componentName = fileName.replace('.tsx', '').toLowerCase();
        
        registry[componentName] = {
          name: fileName.replace('.tsx', ''),
          content,
          dependencies: extractDependencies(content),
        };
      }
    } catch (error) {
      console.warn(`Failed to fetch ${fileName}:`, error);
    }
  }
  
  return registry;
}
```

## 🤖 자동화 설정

### 1. 컴포넌트 동기화 스크립트

#### scripts/sync-components.js
```javascript
#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

async function syncComponents() {
  const sourceDir = path.join(__dirname, '../../../react/radix-ui/src/components/ui');
  const targetDir = path.join(__dirname, '../components');

  try {
    await fs.ensureDir(targetDir);
    await fs.emptyDir(targetDir);

    const files = await fs.readdir(sourceDir);
    
    for (const file of files) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        
        await fs.copy(sourcePath, targetPath);
        console.log(`✅ Copied ${file}`);
      }
    }

    console.log('🎉 Components synced successfully!');
  } catch (error) {
    console.error('❌ Failed to sync components:', error);
    process.exit(1);
  }
}

syncComponents();
```

### 2. GitHub Actions 자동 배포

#### .github/workflows/publish.yml
```yaml
name: Publish dsds CLI

on:
  push:
    branches: [main]
    paths:
      - 'packages/react/radix-ui/src/components/ui/**'
      - 'packages/dsds-cli/**'
  workflow_dispatch:

jobs:
  publish:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: |
          cd packages/dsds-cli
          npm install
      
      - name: Sync components
        run: |
          cd packages/dsds-cli
          npm run sync
      
      - name: Build
        run: |
          cd packages/dsds-cli
          npm run build
      
      - name: Bump version
        run: |
          cd packages/dsds-cli
          npm version patch --no-git-tag-version
      
      - name: Publish to npm
        run: |
          cd packages/dsds-cli
          npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 🚀 배포 및 사용법

### 1. 초기 설정

```bash
# 의존성 설치
cd packages/dsds-cli
npm install

# 컴포넌트 동기화
npm run sync

# 빌드
npm run build

# 로컬 테스트
npm link
```

### 2. npm 배포

```bash
# npm 로그인
npm login

# 배포
npm publish
```

### 3. 사용자 사용법

```bash
# 프로젝트 초기화
npx dsds init

# 컴포넌트 추가
npx dsds add button card

# 사용 가능한 컴포넌트 목록 확인
npx dsds list
```

## 🔄 유지보수

### 자동화된 워크플로우

1. **컴포넌트 업데이트**: 원본 컴포넌트 파일 수정
2. **자동 동기화**: GitHub Actions가 변경사항 감지
3. **자동 빌드**: 새로운 버전으로 빌드
4. **자동 배포**: npm에 새 버전 배포
5. **사용자 업데이트**: `npx dsds@latest` 사용

### 수동 업데이트 (필요시)

```bash
# 컴포넌트 동기화
npm run sync

# 빌드 및 배포
npm run build
npm publish
```

## 📝 주요 특징

- ✅ **실시간 업데이트**: GitHub에서 최신 컴포넌트 자동 가져오기
- ✅ **shadcn 호환**: 동일한 사용자 경험 제공
- ✅ **자동화**: 컴포넌트 변경 시 자동 배포
- ✅ **타입 안전성**: TypeScript 완전 지원
- ✅ **의존성 관리**: 필요한 패키지 자동 감지
- ✅ **설정 가능**: 프로젝트별 커스터마이징 지원

## 🎉 결론

이제 shadcn/ui와 동일한 방식으로 커스텀 컴포넌트 라이브러리를 배포하고 사용할 수 있습니다. 컴포넌트가 업데이트될 때마다 자동으로 CLI에 반영되어 사용자들이 항상 최신 버전을 사용할 수 있습니다.