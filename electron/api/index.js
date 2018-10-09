const apis = require('./apis')

console.log(apis)

global.api = (key, params) => {
  return new Promise((resolve, reject) => apis[key]({ key, params, resolve, reject }))
}

module.exports = {}