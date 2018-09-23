const path = require('path')
const { Menu, Tray } = require('electron')
const { appName, appIcon } = require('../../config/app.config')

const defaultMenus = require('../menus/tray-menus')


function creatTray({ menus = defaultMenus, title = appName, icon } = {}) {
  let tray = new Tray(appIcon)
  tray.setToolTip(title)
  tray.setContextMenu(Menu.buildFromTemplate(menus))
  tray.on('double-click', () => {
    console.log(12333)
  })
  return tray
}

module.exports = {
  creatTray
}