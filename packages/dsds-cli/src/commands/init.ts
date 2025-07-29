import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';

export async function initCommand() {
  console.log(chalk.blue('🚀 Initializing dsds in your project...'));

  const cwd = process.cwd();
  const configPath = path.join(cwd, 'components.json');

  // Check if components.json already exists
  if (await fs.pathExists(configPath)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'components.json already exists. Overwrite?',
      initial: false,
    });

    if (!overwrite) {
      console.log(chalk.yellow('Initialization cancelled.'));
      return;
    }
  }

  // Get project configuration
  const config = await prompts([
    {
      type: 'select',
      name: 'style',
      message: 'Which style would you like to use?',
      choices: [
        { title: 'New York', value: 'new-york' },
        { title: 'Default', value: 'default' },
      ],
      initial: 0,
    },
    {
      type: 'select',
      name: 'baseColor',
      message: 'Which color would you like to use as base color?',
      choices: [
        { title: 'Neutral', value: 'neutral' },
        { title: 'Gray', value: 'gray' },
        { title: 'Zinc', value: 'zinc' },
        { title: 'Stone', value: 'stone' },
        { title: 'Slate', value: 'slate' },
      ],
      initial: 0,
    },
    {
      type: 'text',
      name: 'componentsPath',
      message: 'Where would you like to add your components?',
      initial: './components',
    },
    {
      type: 'text',
      name: 'utilsPath',
      message: 'Where would you like to add your utils?',
      initial: './lib/utils',
    },
  ]);

  const componentConfig = {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: config.style,
    rsc: false,
    tsx: true,
    tailwind: {
      config: 'tailwind.config.js',
      css: 'app/globals.css',
      baseColor: config.baseColor,
      cssVariables: true,
      prefix: '',
    },
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
      ui: `@/${config.componentsPath.replace('./', '')}/ui`,
      lib: '@/lib',
      hooks: '@/hooks',
    },
    iconLibrary: 'lucide',
  };

  await fs.writeJson(configPath, componentConfig, { spaces: 2 });

  // Create components directory
  const componentsDir = path.join(cwd, config.componentsPath, 'ui');
  await fs.ensureDir(componentsDir);

  // Create utils directory and file
  const utilsDir = path.dirname(path.join(cwd, config.utilsPath));
  await fs.ensureDir(utilsDir);
  
  const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

  await fs.writeFile(path.join(cwd, config.utilsPath + '.ts'), utilsContent);

  console.log(chalk.green('✅ dsds initialized successfully!'));
  console.log(chalk.blue('You can now add components with: dsds add button'));
}