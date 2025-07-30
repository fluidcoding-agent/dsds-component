import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export function getPackageManager(targetDir: string): PackageManager {
  // Check for lock files
  if (fs.existsSync(path.join(targetDir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  
  if (fs.existsSync(path.join(targetDir, 'yarn.lock'))) {
    return 'yarn';
  }
  
  if (fs.existsSync(path.join(targetDir, 'bun.lockb'))) {
    return 'bun';
  }
  
  // Default to npm
  return 'npm';
}

export function getPackageManagerCommand(packageManager: PackageManager): {
  install: string;
  add: string;
  addDev: string;
} {
  switch (packageManager) {
    case 'pnpm':
      return {
        install: 'pnpm install',
        add: 'pnpm add',
        addDev: 'pnpm add -D',
      };
    case 'yarn':
      return {
        install: 'yarn',
        add: 'yarn add',
        addDev: 'yarn add -D',
      };
    case 'bun':
      return {
        install: 'bun install',
        add: 'bun add',
        addDev: 'bun add -d',
      };
    default:
      return {
        install: 'npm install',
        add: 'npm install',
        addDev: 'npm install -D',
      };
  }
}