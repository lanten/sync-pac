const path = require('path')


const config = {
  port: 3311,
  source: path.join(__dirname, '../src/app'),
  template: path.join(__dirname, '../src/app/index.html'),
  dist: path.join(__dirname, '../dist'),
  publicPath: '/'
}

module.exports = config
