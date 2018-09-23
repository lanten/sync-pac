
const { createWindow } = require('../window')



const trayMenus = [

  { label: 'PAC 管理', click: () => createWindow('pac') },

  { type: 'separator' },

  { label: 'PAC 列表', id: 'pac-list' },

  { type: 'separator' },

  { label: '退出', role: 'quit' }
]




module.exports = trayMenus