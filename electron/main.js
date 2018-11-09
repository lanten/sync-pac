const path = require('path')
const { app, BrowserWindow } = require('electron')
const { creatTray } = require('./tray')
const { createWindow } = require('./window')

const { NODE_ENV } = process.env

// 主进程 API
global.api = require('./api')

// 载入用户设置
Object.defineProperty(global, 'userConfig', {
  get() {
    return global.api.getConfig()
  }
})

let tray

if (NODE_ENV === 'development') {
  // react-developer-tools
  require('electron-debug')({ showDevTools: false })
  app.on('ready', () => {
    let installExtension = require('electron-devtools-installer')
    installExtension.default(installExtension.REACT_DEVELOPER_TOOLS).then(() => {
    }).catch(err => {
      console.log('Unable to install `react-developer-tools`: \n', err)
    })
  })
}

// 在 macOS dock 中隐藏
// app.dock.hide()

app.on('ready', () => {
  tray = creatTray()
  createWindow('pac')
})

app.on('window-all-closed', e => {
  // e.preventDefault()
})

app.on('before-quit', () => {
  // 只在 win 系统下销毁托盘图标
  if (process.platform === 'win32') {
    tray.destroy()
  }
})