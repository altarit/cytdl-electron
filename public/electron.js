const electron = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const {ipcMain} = electron

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {webSecurity: false, nodeIntegration: true}
  })
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('request', (e, ...args) => {
  console.log('received: request', args)
  e.reply('response', 'pong')
})
