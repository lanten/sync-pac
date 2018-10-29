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
  let url, hash = urls[key], config = {}
  if (typeof hash === 'object') {
    config = hash.config || {}
    hash = hash.url
  }
  if (NODE_ENV === 'development') {
    url = `http://localhost:${port}#${hash}`
  } else {
    url = `file://${path.join(__dirname, '../../dist/index.html')}#${hash}`
  }
  return { url, config }
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

  const { url, config } = getWindowUrl(key)

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
    ...config
  }
  win = new BrowserWindow(Object.assign(defaultOptions, options))
  // console.log(win.webContents.location)
  windowList[key] = win
  win.loadURL(url)
  win.once('ready-to-show', () => {
    win.show()
    win.webContents.openDevTools()
  })

  win.on('close', e => {
    delete windowList[key]
  })

  return win
}


module.exports = {
  createWindow,
  getWindowUrl,
  windowList,
}