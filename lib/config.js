const port = 3456
const host = 'localhost'
const url = `http://${host}:${port}`

const config = {
  server: {
    port,
    host
  },
  client: {
    url
  }
}

module.exports = config
