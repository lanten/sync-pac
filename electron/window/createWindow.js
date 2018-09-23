const path = require('path')
const { app, BrowserWindow } = require('electron')
const { appIcon } = require('../../config/app.config')
const { port } = require('../../config/dev.config')

const urls = require('./window-urls')

const { NODE_ENV } = process.env

/**
 * 
 * @param {String} urlKey 
 */
function getWindowUrl() {
  let winURL
  if (NODE_ENV === 'development') {
    winURL = `http://localhost:${port}`
  } else {
    winURL = `file://${path.join(__dirname, '../dist/index.html')}`
  }
  return winURL
}

/**
 * 
 * @param {String} urlKey
 * @param {Object} BrowserWindowOptions 
 */
function createWindow(key, options = {}) {
  let url = urls[key]
  global.hashRoute = url
  const defaultOptions = {
    icon: appIcon,
    width: 800,
    height: 600,
    // frame: false, // 无边框窗口
    show: false,
    skipTaskbar: false, // 是否在任务栏中隐藏窗口
    // backgroundColor: '#fff',
    // transparent: true, // 窗口是否透明
  }
  let win = new BrowserWindow(Object.assign(defaultOptions, options))
  // console.log(win.webContents.location)

  win.loadURL(getWindowUrl())
  win.once('ready-to-show', () => {
    win.show()
    win.webContents.openDevTools()
  })

  return win
}


module.exports = {
  createWindow,
  getWindowUrl,
}