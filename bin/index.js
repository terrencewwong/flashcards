require('yargs')
  .commandDir('cmds')
  .demandCommand(1)
  .help()
  .argv
