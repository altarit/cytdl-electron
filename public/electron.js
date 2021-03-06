const electron = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const {ipcMain} = electron

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1600 : 940,
    height: isDev ? 800 : 700,
    webPreferences: {webSecurity: false, nodeIntegration: true}
  })
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  mainWindow.on('closed', () => (mainWindow = null))

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
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
  e.reply('response', { text: 'pong' })
})
