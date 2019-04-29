const createWindow = require('./createWindow')
const urls = require('./window-urls')

module.exports = {
  ...createWindow,
  urls
}