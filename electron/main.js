const path = require('path')
const { app, BrowserWindow } = require('electron')
const { creatTray } = require('./tray')
const { createWindow } = require('./window')

const { NODE_ENV } = process.env

let tray

if (NODE_ENV === 'development') {

  // react-developer-tools
  require('electron-debug')({ showDevTools: false })
  app.on('ready', () => {
    let installExtension = require('electron-devtools-installer')
    installExtension.default(installExtension.REACT_DEVELOPER_TOOLS).then(() => {

    }).catch(err => {
      console.log('Unable to install `react-developer-tools`: \n', err)
    })
  })
}


app.on('ready', () => {
  tray = creatTray()
})

app.on('window-all-closed', e => {
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
  // console.log(e)
})

app.on('before-quit', e => {
  tray.destroy()
})

// app.on('activate', function () {
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

