import path from 'path'
import chalk from 'chalk'
import { spawn } from 'child_process'
import electron from 'electron'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from './webpack.config'
import webpackConfigMain from './webpack.config.main'
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
    hotMiddleware = webpackHotMiddleware(webpackCompiler, {
      log: false,
      heartbeat: 2500
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

function startMain() {
  return new Promise((resolve, reject) => {

    const compiler = webpack(webpackConfigMain)

    compiler.plugin('watch-run', (compilation, done) => {
      electronLog('compiling...', 'Main', 'yellow')
      hotMiddleware.publish({ action: 'compiling' })
      done()
    })

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }

      if (electronProcess && electronProcess.kill) {
        manualRestart = true
        process.kill(electronProcess.pid)
        electronProcess = null
        startElectron()

        setTimeout(() => {
          manualRestart = false
        }, 5000)
      }

      resolve()
    })
  })
}

function startElectron() {
  electronProcess = spawn(electron, ['--inspect=5858', '.'])

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'Electron', 'blue')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'Electron', 'yellow')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}


function electronLog(data, type, color = 'gray') {
  console.log(chalk[color](`\n┏ ---------------------------- [${type}] `))
  console.log(chalk[color](data))
  console.log(chalk[color](`┗ ----------------------------`))
}

Promise.all([startRenderer(), startMain()]).then(() => {
  startElectron()
}).catch(err => {
  console.error(err)
})