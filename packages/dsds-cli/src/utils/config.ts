import fs from 'fs-extra';
import path from 'path';

export interface Config {
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
    lib: string;
    hooks: string;
  };
  iconLibrary: string;
}

export async function getConfig(cwd: string): Promise<Config | null> {
  const configPath = path.join(cwd, 'components.json');
  
  if (!(await fs.pathExists(configPath))) {
    return null;
  }

  try {
    return await fs.readJson(configPath);
  } catch (error) {
    return null;
  }
}