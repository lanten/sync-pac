import path from 'path'
import chalk from 'chalk'
import { spawn } from 'child_process'
import electron from 'electron'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from './webpack.config'
import { port, source } from '../config/dev.config'

let electronProcess = null
let manualRestart = false
let hotMiddleware

function startRenderer() {
  return new Promise((resolve, reject) => {

    // 热加载
    const hotClient = path.join(__dirname, './dev-client')
    if (typeof webpackConfig.entry == 'object') {
      Object.keys(webpackConfig.entry).forEach((name) => {
        const value = webpackConfig.entry[name]
        if (Array.isArray(value)) {
          value.unshift(hotClient)
        } else {
          webpackConfig.entry[name] = [hotClient, value]
        }
      })
    } else {
      webpackConfig.entry = [hotClient, webpackConfig.entry]
    }
    const webpackCompiler = webpack(webpackConfig)
    const hotMiddleware = webpackHotMiddleware(webpackCompiler, {
      log: false,
      // heartbeat: 2500
    })

    // 启用 dev-server
    const server = new WebpackDevServer(
      webpackCompiler,
      {
        contentBase: source,
        quiet: true, // 隐藏日志
        before(app, ctx) {
          app.use(hotMiddleware)
          ctx.middleware.waitUntilValid((err) => {
            console.log(`dev-server at ${chalk.magenta.underline(`http://localhost:${port}`)}`)
            resolve()
          })
        },
      }
    )
    server.listen(port)
  })
}

function startElectron() {
  electronProcess = spawn(electron, ['--inspect=5858', '.'])

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'yellow')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}


function electronLog(data, color) {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach(line => {
    log += `  ${line}\n`
  })
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold('\n┏ Electron -------------------') +
      '\n\n' +
      log +
      chalk[color].bold('┗ ----------------------------') +
      '\n'
    )
  }
}

startRenderer().then(startElectron)