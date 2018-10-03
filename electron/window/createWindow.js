const path = require('path')
const { app, BrowserWindow } = require('electron')
const { appIcon } = require('../../config/app.config')
const { port } = require('../../config/dev.config')

const urls = require('./window-urls')

const { NODE_ENV } = process.env

const windowList = {}

/**
 * 
 * @param {String} urlKey 
 */
function getWindowUrl(key) {
  let winURL, hash = urls[key]
  if (NODE_ENV === 'development') {
    winURL = `http://localhost:${port}#${hash}`
  } else {
    winURL = `file://${path.join(__dirname, '../../dist/index.html')}#${hash}`
  }
  return winURL
}

/**
 * 
 * @param {String} urlKey
 * @param {Object} BrowserWindowOptions 
 */
function createWindow(key, options = {}) {
  let win = windowList[key]
  if (windowList[key]) {
    win.show()
    return win
  }
  const defaultOptions = {
    icon: appIcon,
    width: 800,
    height: 600,
    // frame: false, // 无边框窗口
    show: false,
    hasShadow: true,
    // skipTaskbar: false, // 是否在任务栏中隐藏窗口
    // backgroundColor: '#fff',
    // transparent: true, // 窗口是否透明
    // titleBarStyle: 'hidden',
    vibrancy: 'appearance-based',
  }
  win = new BrowserWindow(Object.assign(defaultOptions, options))
  // console.log(win.webContents.location)
  windowList[key] = win
  win.loadURL(getWindowUrl(key))
  win.once('ready-to-show', () => {
    win.show()
    // win.webContents.openDevTools()
  })

  win.on('closed', e => {
    delete windowList[key]
  })

  return win
}


module.exports = {
  createWindow,
  getWindowUrl,
  windowList,
}