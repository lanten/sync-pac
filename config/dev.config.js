import path from 'path'


const config = {
  source: path.join(__dirname, '../src/app'),
  template: path.join(__dirname, '../src/app/index.html'),
  dist: path.join(__dirname, '../dist'),
  publicPath: '/'
}

export default config