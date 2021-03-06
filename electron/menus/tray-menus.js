const { shell } = require('electron')

const { createWindow } = require('../window')



const trayMenus = [

  { label: 'PAC 管理', click: () => createWindow('pac') },

  { type: 'separator' },

  { label: '设置', click: () => createWindow('setting') },

  { type: 'separator' },

  { label: '提交问题', click: () => shell.openExternal('https://github.com/lanten/sync-pac/issues') },
  { label: '关于', click: () => createWindow('about') },
  { label: '退出', role: 'quit' }
]

module.exports = trayMenus