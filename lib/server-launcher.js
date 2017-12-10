// @flow
const forever = require('forever-monitor')
const path = require('path')

const DONE_INITIALIZING = 'done'

const serverPath = path.join(__dirname, './server/index.js')

export default (): Promise<*> => {
  return new Promise((resolve, reject) => {
    process.stdout.write('initializing flashcard server...')

    const child = new (forever.Monitor)(serverPath)
    child.on('stdout', (data) => {
      const message = data.toString().trim()
      if (message === DONE_INITIALIZING) {
        resolve()
      }
    })

    child.start()

    // TODO: reject promise if something goes wrong :P
  })
}

export const notifyLauncherDoneInitializing = () => {
  console.log(DONE_INITIALIZING)
}
