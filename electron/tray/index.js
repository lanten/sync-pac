const path = require('path')
const { Menu, Tray } = require('electron')
const { appName, appIcon } = require('../../config/app.config')

const defaultMenus = require('./menus')

let tray = null

function creatTray({ menus = defaultMenus, title = appName, icon } = {}) {
  tray = new Tray(appIcon)
  tray.setToolTip(title)
  tray.setContextMenu(Menu.buildFromTemplate(menus))
  tray.on('double-click', () => {
    console.log(12333)
  })
}

module.exports = {
  tray, creatTray
}