import chalk from 'chalk';
import { getComponentRegistry } from '../utils/registry';

export async function listCommand() {
  console.log(chalk.blue('📦 Available dsds components:'));
  console.log();

  try {
    const registry = await getComponentRegistry();
    const components = Object.keys(registry);

    if (components.length === 0) {
      console.log(chalk.yellow('No components found.'));
      return;
    }

    components.sort().forEach(component => {
      const info = registry[component];
      console.log(chalk.green(`  ${component}`));
      if (info.dependencies && info.dependencies.length > 0) {
        console.log(chalk.gray(`    Dependencies: ${info.dependencies.join(', ')}`));
      }
    });

    console.log();
    console.log(chalk.blue(`Total: ${components.length} components`));
    console.log();
    console.log(chalk.gray('Usage: dsds add <component-name>'));
    console.log(chalk.gray('Example: dsds add button card'));
  } catch (error) {
    console.error(chalk.red('Failed to fetch component list:'), error);
  }
}