
const { createWindow } = require('../window')



const trayMenus = [

  { label: 'PAC 管理', click: () => createWindow('pac') },

  { type: 'separator' },

  { label: 'PAC 列表', id: 'pac-list' },
  { label: '设置', click: () => createWindow('setting') },

  { type: 'separator' },

  { label: '关于', click: () => createWindow('about') },
  { label: '退出', role: 'quit' }
]




module.exports = trayMenus