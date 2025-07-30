import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import { execSync } from 'child_process';
import { getConfig } from '../utils/config';
import { getRegistryItem, transformImports } from '../utils/registry';
import { getPackageManager, getPackageManagerCommand } from '../utils/get-package-manager';

interface AddOptions {
  yes?: boolean;
  overwrite?: boolean;
  cwd?: string;
  all?: boolean;
  path?: string;
}

export async function addCommand(components: string[], options: AddOptions = {}) {
  const cwd = options.cwd || process.cwd();
  
  // Check if components.json exists
  const config = await getConfig(cwd);
  if (!config) {
    console.log(chalk.red('components.json not found. Please run `dsds init` first.'));
    return;
  }

  if (!components.length) {
    console.log(chalk.red('Please specify the components to add.'));
    console.log('');
    console.log('Example:');
    console.log('  npx dsds add button');
    console.log('  npx dsds add button card');
    console.log('');
    console.log('Run `npx dsds list` to see all available components.');
    return;
  }

  const spinner = ora('Checking registry...').start();
  
  // Validate components exist in registry
  const registryItems = [];
  for (const component of components) {
    const item = await getRegistryItem(component);
    if (!item) {
      spinner.fail(`Component "${component}" not found.`);
      console.log('');
      console.log('Run `npx dsds list` to see all available components.');
      return;
    }
    registryItems.push(item);
  }
  
  spinner.succeed('Registry checked');

  // Check for existing files
  const existingFiles = [];
  for (const item of registryItems) {
    for (const file of item.files) {
      const filePath = path.join(
        cwd,
        config.aliases.ui.replace('@/', ''),
        file.name
      );
      
      if (await fs.pathExists(filePath)) {
        existingFiles.push(file.name);
      }
    }
  }

  if (existingFiles.length && !options.overwrite && !options.yes) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `The following files already exist:\n${existingFiles.map(f => `  - ${f}`).join('\n')}\n\nWould you like to overwrite them?`,
      initial: false,
    });

    if (!overwrite) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }
  }

  // Install dependencies
  const allDependencies = new Set<string>();
  const allDevDependencies = new Set<string>();
  
  for (const item of registryItems) {
    if (item.dependencies) {
      item.dependencies.forEach(dep => allDependencies.add(dep));
    }
    if (item.devDependencies) {
      item.devDependencies.forEach(dep => allDevDependencies.add(dep));
    }
  }

  if (allDependencies.size > 0 || allDevDependencies.size > 0) {
    const packageManager = getPackageManager(cwd);
    const commands = getPackageManagerCommand(packageManager);
    
    const depsSpinner = ora('Installing dependencies...').start();
    
    try {
      if (allDependencies.size > 0) {
        execSync(`${commands.add} ${Array.from(allDependencies).join(' ')}`, {
          cwd,
          stdio: 'pipe',
        });
      }
      
      if (allDevDependencies.size > 0) {
        execSync(`${commands.addDev} ${Array.from(allDevDependencies).join(' ')}`, {
          cwd,
          stdio: 'pipe',
        });
      }
      
      depsSpinner.succeed('Dependencies installed');
    } catch (error) {
      depsSpinner.warn('Failed to install some dependencies');
      console.log(chalk.yellow('Please install the following dependencies manually:'));
      if (allDependencies.size > 0) {
        console.log(chalk.gray(`Dependencies: ${Array.from(allDependencies).join(' ')}`));
      }
      if (allDevDependencies.size > 0) {
        console.log(chalk.gray(`Dev dependencies: ${Array.from(allDevDependencies).join(' ')}`));
      }
    }
  }

  // Add components
  const addSpinner = ora('Adding components...').start();
  
  try {
    for (const item of registryItems) {
      for (const file of item.files) {
        const filePath = path.join(
          cwd,
          config.aliases.ui.replace('@/', ''),
          file.name
        );
        
        await fs.ensureDir(path.dirname(filePath));
        
        // Transform imports based on config
        const transformedContent = transformImports(file.content, config);
        
        await fs.writeFile(filePath, transformedContent);
      }
    }
    
    addSpinner.succeed(`Added ${components.length} component${components.length > 1 ? 's' : ''}`);
  } catch (error) {
    addSpinner.fail('Failed to add components');
    console.error(error);
    return;
  }

  console.log('');
  console.log(chalk.green('Success! Components added to your project.'));
  console.log('');
}