const path = require('path')
const { Menu, Tray } = require('electron')
const { appName } = require('../../config/app.config')

const defaultMenus = require('./menus')

let tray = null

function creatTray({ menus = defaultMenus, title = appName, icon } = {}) {
  const iconPath = path.join(__dirname, './icon-tray.png')
  tray = new Tray(iconPath)
  tray.setToolTip(title)
  tray.setContextMenu(Menu.buildFromTemplate(menus))
}

module.exports = {
  tray, creatTray
}