import chalk from 'chalk';
import { getRegistry } from '../utils/registry';

export async function listCommand() {
  console.log(chalk.blue('Available components:'));
  console.log('');
  
  const registry = await getRegistry();
  const components = Object.keys(registry).sort();
  
  if (components.length === 0) {
    console.log(chalk.gray('No components available.'));
    return;
  }
  
  for (const component of components) {
    const item = registry[component];
    console.log(`${chalk.green('●')} ${chalk.bold(component)}`);
    
    if (item.dependencies && item.dependencies.length > 0) {
      console.log(`  ${chalk.gray('Dependencies:')} ${item.dependencies.join(', ')}`);
    }
    
    console.log('');
  }
  
  console.log(chalk.gray(`Total: ${components.length} component${components.length > 1 ? 's' : ''}`));
  console.log('');
  console.log('Usage:');
  console.log('  npx dsds add [component]');
  console.log('');
  console.log('Example:');
  console.log('  npx dsds add button');
  console.log('  npx dsds add button card');
}