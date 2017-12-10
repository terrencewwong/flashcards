#!/usr/bin/env node
import 'babel-polyfill'

require('yargs')
  .commandDir('cmds')
  .demandCommand(1)
  .help()
  .argv
