// Modules to control application life and create native browser window
const electron = require('electron')
const { app, BrowserWindow } = electron
const { port } = require('../config/dev.config')

const { NODE_ENV } = process.env

// let mainWindow

// function createWindow() {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({ width: 800, height: 600 })

//   // and load the index.html of the app.
//   // mainWindow.loadFile(path.join(__dirname, 'index.html'))
//   mainWindow.loadURL(`http://localhost:${port}`)

//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools()

//   // Emitted when the window is closed.
//   mainWindow.on('closed', function () {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null
//   })
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

// // Quit when all windows are closed.
// app.on('window-all-closed', function () {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', function () {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

let mainWindow, winURL

if (NODE_ENV === 'development') {
  winURL = `http://localhost:${port}`

  // react-developer-tools
  require('electron-debug')({ showDevTools: true })
  require('electron').app.on('ready', () => {
    let installExtension = require('electron-devtools-installer')
    installExtension.default(installExtension.REACT_DEVELOPER_TOOLS)
      .then(() => { })
      .catch(err => {
        console.log('Unable to install `react-developer-tools`: \n', err)
      })
  })
} else {
  winURL = `file://${__dirname}/index.html`
}

