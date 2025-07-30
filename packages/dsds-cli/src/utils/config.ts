import fs from 'fs-extra';
import path from 'path';

export interface Config {
  $schema?: string;
  style: string;
  rsc: boolean;
  tsx: boolean;
  tailwind: {
    config: string;
    css: string;
    baseColor: string;
    cssVariables: boolean;
    prefix: string;
  };
  aliases: {
    components: string;
    utils: string;
    ui: string;
  };
}

export const DEFAULT_CONFIG: Config = {
  $schema: 'https://ui.shadcn.com/schema.json',
  style: 'default',
  rsc: true,
  tsx: true,
  tailwind: {
    config: 'tailwind.config.js',
    css: 'app/globals.css',
    baseColor: 'slate',
    cssVariables: true,
    prefix: '',
  },
  aliases: {
    components: '@/components',
    utils: '@/lib/utils',
    ui: '@/components/ui',
  },
};

export async function getConfig(cwd: string): Promise<Config | null> {
  const configPath = path.join(cwd, 'components.json');
  
  if (!(await fs.pathExists(configPath))) {
    return null;
  }

  try {
    const config = await fs.readJson(configPath);
    return config as Config;
  } catch (error) {
    return null;
  }
}

export async function writeConfig(cwd: string, config: Config): Promise<void> {
  const configPath = path.join(cwd, 'components.json');
  await fs.writeJson(configPath, config, { spaces: 2 });
}

export function resolveImport(importPath: string, config: Config): string {
  if (importPath.startsWith('@/components/ui')) {
    return importPath.replace('@/components/ui', config.aliases.ui);
  }
  
  if (importPath.startsWith('@/lib/utils')) {
    return importPath.replace('@/lib/utils', config.aliases.utils);
  }
  
  if (importPath.startsWith('@/components')) {
    return importPath.replace('@/components', config.aliases.components);
  }
  
  return importPath;
}