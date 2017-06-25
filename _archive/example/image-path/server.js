import express from 'express';
import chalk from 'chalk';
import uiharness from '../../lib/server';
import log from '../../lib/shared/log';


log.info(chalk.cyan('--------------------------------------------------------'));
log.info(chalk.cyan('Custom Image Path Example'));
log.info(chalk.cyan('--------------------------------------------------------'));


// See the .uiharness.yml
uiharness.start({
  entry: './example/image-path/specs',
})
.catch(err => {
  log.error(chalk.red(`Error while starting UIHarness:`));
  log.error(chalk.red(err.message))
  console.error();
});
