const {url} = require('../config').client

module.exports = {
  nextCard: {
    url: `${url}/next-card`,
    method: 'GET'
  },

  submitCard: {
    url: `${url}/submit-card`,
    method: 'POST'
  },

  checkHealth: {
    url: `${url}/_health`,
    method: 'GET'
  }
}
