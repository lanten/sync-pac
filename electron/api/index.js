const { remote } = require('electron')
const apis = require('./apis')

global.api = (key, params) => {
  return new Promise((resolve, reject) => apis[key]({ ...arguments, resolve, reject }))
}

module.exports = {}