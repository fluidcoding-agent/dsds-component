import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import { execSync } from 'child_process';
import { DEFAULT_CONFIG, writeConfig, type Config } from '../utils/config';
import { getPackageManager, getPackageManagerCommand } from '../utils/get-package-manager';

interface InitOptions {
  yes?: boolean;
  defaults?: boolean;
  cwd?: string;
}

export async function initCommand(options: InitOptions = {}) {
  const cwd = options.cwd || process.cwd();
  
  console.log(chalk.blue('Welcome to dsds/ui!'));
  console.log('');
  
  // Check if components.json already exists
  const configPath = path.join(cwd, 'components.json');
  if (await fs.pathExists(configPath)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'components.json already exists. Would you like to overwrite it?',
      initial: false,
    });
    
    if (!overwrite) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }
  }

  let config = { ...DEFAULT_CONFIG };

  if (!options.defaults && !options.yes) {
    const responses = await prompts([
      {
        type: 'select',
        name: 'style',
        message: 'Which style would you like to use?',
        choices: [
          { title: 'Default', value: 'default' },
          { title: 'New York', value: 'new-york' },
        ],
        initial: 0,
      },
      {
        type: 'select',
        name: 'baseColor',
        message: 'Which color would you like to use as base color?',
        choices: [
          { title: 'Slate', value: 'slate' },
          { title: 'Gray', value: 'gray' },
          { title: 'Zinc', value: 'zinc' },
          { title: 'Neutral', value: 'neutral' },
          { title: 'Stone', value: 'stone' },
        ],
        initial: 0,
      },
      {
        type: 'confirm',
        name: 'cssVariables',
        message: 'Would you like to use CSS variables for colors?',
        initial: true,
      },
      {
        type: 'text',
        name: 'tailwindConfig',
        message: 'Where is your tailwind.config.js located?',
        initial: 'tailwind.config.js',
      },
      {
        type: 'text',
        name: 'tailwindCss',
        message: 'Where is your global CSS file?',
        initial: 'app/globals.css',
      },
      {
        type: 'confirm',
        name: 'rsc',
        message: 'Would you like to use React Server Components?',
        initial: true,
      },
      {
        type: 'text',
        name: 'componentsPath',
        message: 'Configure the import alias for components?',
        initial: '@/components',
      },
      {
        type: 'text',
        name: 'utilsPath',
        message: 'Configure the import alias for utils?',
        initial: '@/lib/utils',
      },
    ]);

    config = {
      ...config,
      style: responses.style,
      rsc: responses.rsc,
      tailwind: {
        ...config.tailwind,
        config: responses.tailwindConfig,
        css: responses.tailwindCss,
        baseColor: responses.baseColor,
        cssVariables: responses.cssVariables,
      },
      aliases: {
        ...config.aliases,
        components: responses.componentsPath,
        utils: responses.utilsPath,
      },
    };
  }

  const spinner = ora('Creating components.json...').start();
  
  try {
    await writeConfig(cwd, config);
    spinner.succeed('Created components.json');
  } catch (error) {
    spinner.fail('Failed to create components.json');
    console.error(error);
    return;
  }

  // Create utils file if it doesn't exist
  const utilsPath = config.aliases.utils.replace('@/', '');
  const utilsFilePath = path.join(cwd, utilsPath + '.ts');
  
  if (!(await fs.pathExists(utilsFilePath))) {
    const utilsSpinner = ora('Creating utils file...').start();
    
    try {
      await fs.ensureDir(path.dirname(utilsFilePath));
      await fs.writeFile(utilsFilePath, `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`);
      utilsSpinner.succeed('Created utils file');
    } catch (error) {
      utilsSpinner.fail('Failed to create utils file');
      console.error(error);
    }
  }

  // Install dependencies
  const packageManager = getPackageManager(cwd);
  const commands = getPackageManagerCommand(packageManager);
  
  const depsSpinner = ora('Installing dependencies...').start();
  
  try {
    execSync(`${commands.addDev} clsx tailwind-merge class-variance-authority`, {
      cwd,
      stdio: 'pipe',
    });
    depsSpinner.succeed('Installed dependencies');
  } catch (error) {
    depsSpinner.fail('Failed to install dependencies');
    console.log(chalk.yellow('Please install the following dependencies manually:'));
    console.log(chalk.gray('clsx tailwind-merge class-variance-authority'));
  }

  console.log('');
  console.log(chalk.green('Success! Your project has been configured.'));
  console.log('');
  console.log('You can now start adding components:');
  console.log(chalk.gray('  npx dsds add button'));
  console.log('');
}