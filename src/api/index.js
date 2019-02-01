

const electron = require( './api.electron').default
for (const key in electron) {
  module.exports[key] = electron[key]
}
