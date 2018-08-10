import path from 'path'
import electron from 'electron'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from './webpack.config'


function startRenderer() {
  return new Promise((resolve, reject) => {
    webpackConfig.devtool = 'source-map'

    // 热加载
    const hotclient = [
      'webpack-hot-middleware/client?noInfo=true&reload=true',
      // "css-hot-loader?fileMap='../css/{fileName}"
    ]
    if (typeof webpackConfig.entry == 'object') {
      Object.keys(webpackConfig.entry).forEach((name) => {
        const value = webpackConfig.entry[name]
        if (Array.isArray(value)) {
          value.unshift(...hotclient)
        } else {
          webpackConfig.entry[name] = [...hotclient, value]
        }
      })
    } else {
      webpackConfig.entry = [...hotclient, webpackConfig.entry]
    }

    const webpackCompiler = webpack(webpackConfig)

    const hotMiddleware = webpackHotMiddleware(webpackCompiler, {
      log: false
    })


    const server = new WebpackDevServer(
      webpackCompiler,
      {
        contentBase: path.join(__dirname, '../'),
        quiet: true,
        before(app, ctx) {
          app.use(hotMiddleware)
          ctx.middleware.waitUntilValid(() => {
            resolve()
          })
        }
      }
    )

    server.listen(8060)
  })
}

function startElectron() {
  electronProcess = spawn(electron, ['--inspect=5858', '.'])

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red')
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
      chalk[color].bold('┏ Electron -------------------') +
      '\n\n' +
      log +
      chalk[color].bold('┗ ----------------------------') +
      '\n'
    )
  }
}

function startMain() {
  return new Promise((resolve, reject) => {
    mainConfig.entry.main = [path.join(__dirname, '../src/main/index.dev.js')].concat(mainConfig.entry.main)

    const compiler = webpack(mainConfig)

    compiler.plugin('watch-run', (compilation, done) => {
      logStats('Main', chalk.white.bold('compiling...'))
      hotMiddleware.publish({ action: 'compiling' })
      done()
    })

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }

      logStats('Main', stats)

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

startRenderer().then(res => {
  console.log(res)
})