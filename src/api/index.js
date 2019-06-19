
const electron = require('./api.electron').default

console.log(electron)

for (const key in electron) {
  module.exports[key] = electron[key]
}


// for (const key in gistApis) {
//   module.exports[key] = gistApis[key]
// }

export * from './request.gists'
