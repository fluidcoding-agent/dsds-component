import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getComponentRegistry } from '../utils/registry';
import { getConfig } from '../utils/config';
import { transformImports } from '../utils/transform';

export async function addCommand(components: string[]) {
  const cwd = process.cwd();
  
  // Check if components.json exists
  const config = await getConfig(cwd);
  if (!config) {
    console.log(chalk.red('❌ components.json not found. Run `dsds init` first.'));
    return;
  }

  if (components.length === 0) {
    console.log(chalk.yellow('Please specify components to add.'));
    console.log(chalk.blue('Example: dsds add button card dialog'));
    return;
  }

  const registry = await getComponentRegistry();
  const spinner = ora('Adding components...').start();

  try {
    for (const componentName of components) {
      const component = registry[componentName.toLowerCase()];
      
      if (!component) {
        spinner.fail(chalk.red(`Component "${componentName}" not found.`));
        console.log(chalk.blue('Available components:'), Object.keys(registry).join(', '));
        continue;
      }

      // Create component directory
      const componentPath = path.join(
        cwd,
        config.aliases.ui.replace('@/', ''),
        `${component.name}.tsx`
      );

      await fs.ensureDir(path.dirname(componentPath));

      // Transform imports based on user's config
      const transformedContent = transformImports(component.content, config);
      
      await fs.writeFile(componentPath, transformedContent);
      
      spinner.succeed(chalk.green(`Added ${component.name}`));
    }

    console.log(chalk.green('✅ Components added successfully!'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to add components'));
    console.error(error);
  }
}