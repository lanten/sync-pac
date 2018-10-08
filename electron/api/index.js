const apis = require('./apis')

global.api = (key, params) => {
  return new Promise((resolve, reject) => apis[key]({ key, params, resolve, reject }))
}

module.exports = {}