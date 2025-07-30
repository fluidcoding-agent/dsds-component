import fs from 'fs-extra';
import path from 'path';

export interface ComponentFile {
  name: string;
  content: string;
}

export interface RegistryItem {
  name: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: ComponentFile[];
  type: 'components:ui' | 'components:component' | 'components:example';
}

export interface Registry {
  [key: string]: RegistryItem;
}

export async function getRegistry(): Promise<Registry> {
  const registryPath = path.join(__dirname, '../../registry.json');
  
  try {
    const registry = await fs.readJson(registryPath);
    return registry as Registry;
  } catch (error) {
    console.error('Failed to load registry:', error);
    return {};
  }
}

export async function getRegistryItem(name: string): Promise<RegistryItem | null> {
  const registry = await getRegistry();
  return registry[name] || null;
}

export function transformImports(content: string, config: any): string {
  // Transform @/lib/utils imports
  content = content.replace(
    /from ["']@\/lib\/utils["']/g,
    `from "${config.aliases.utils}"`
  );
  
  // Transform @/components/ui imports
  content = content.replace(
    /from ["']@\/components\/ui\/([^"']+)["']/g,
    `from "${config.aliases.ui}/$1"`
  );
  
  return content;
}