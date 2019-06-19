const { app } = require('electron')

const appMenus = [
  {
    label: "Application",
    submenu: [
      { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click: function () { app.quit() } }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  }
]

module.exports = appMenus