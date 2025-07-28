#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { addCommand } from './commands/add';
import { initCommand } from './commands/init';
import { listCommand } from './commands/list';

const program = new Command();

program
  .name('dsds')
  .description('CLI tool for adding UI components to your project')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize dsds in your project')
  .action(initCommand);

program
  .command('add')
  .description('Add components to your project')
  .argument('[components...]', 'components to add')
  .action(addCommand);

program
  .command('list')
  .description('List all available components')
  .action(listCommand);

program.parse();