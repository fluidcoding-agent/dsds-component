#!/usr/bin/env node

import { Command } from 'commander';
import { addCommand } from './commands/add';
import { initCommand } from './commands/init';
import { listCommand } from './commands/list';

const program = new Command();

program
  .name('dsds')
  .description('Add components and dependencies to your project')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize your project and install dependencies')
  .option('-y, --yes', 'skip confirmation prompt')
  .option('-d, --defaults', 'use default configuration')
  .action(initCommand);

program
  .command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'the components to add')
  .option('-y, --yes', 'skip confirmation prompt')
  .option('-o, --overwrite', 'overwrite existing files')
  .option('-c, --cwd <cwd>', 'the working directory')
  .option('-a, --all', 'add all available components')
  .option('-p, --path <path>', 'the path to add the component to')
  .action(addCommand);

program
  .command('list')
  .description('List all available components')
  .action(listCommand);

program.parse();