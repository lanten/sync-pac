const path = require('path')
const webpack = require('webpack')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


const { NODE_ENV } = process.env

const projectPath = process.cwd()
const appPath = path.join(__dirname, `../electron`)


console.log(NODE_ENV, appPath)

const webpackConfig = {
  mode: NODE_ENV,
  target: 'electron-main',
  entry: {
    main: `${appPath}/main.js`,
  },
  resolve: {
    modules: [projectPath, 'node_modules'],
  },
  output: {
    path: path.join(__dirname, '../dist/electron'),
    filename: '[name].js',
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        include: appPath,
        loader: ['babel-loader']
      },
    ]
  },
  plugins: [],
}

if (NODE_ENV == 'development') {
  // 开花环境配置
  webpackConfig.plugins.push(
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  )
} else if (NODE_ENV == 'production') {
  // 生产环境配置
  webpackConfig.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          pure_funcs: ['console.log'], // 删除console.log, 保留 info ，warn，error 等
        },
      }
    })
  )
}

module.exports = webpackConfig