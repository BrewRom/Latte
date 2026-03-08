import { app, shell, BrowserWindow, ipcMain, protocol, net } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { spawn } from 'child_process'
import icon from '../../resources/icon.png?asset'
import path from 'path'
import * as fs from 'fs'
import { setHandles } from './funcs'



protocol.registerSchemesAsPrivileged([
  {
    scheme: 'latte',
    privileges: {
      secure: true,
      supportFetchAPI: true, // Important for net.fetch
      standard: true,
      bypassCSP: true,
      stream: true
    }
  }
])

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    resizable: false,
    fullscreen: false, //Set to true on final build
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // On start it should check if its config file exists
  // If not then create the config location in the .config folder in home
  // This is where we would store information such as the location of the background image

  const configFolder = '/home/hazy/.config/latte/config'
  try {
    if (!fs.existsSync(configFolder)) {
      fs.mkdirSync(configFolder)
      fs.copyFileSync('latte.json', '/home/hazy/.config/latte/config/latte.json')
    }

    console.log('Config folder exists')
  } catch (err) {
    console.error(err)
  }

  const file = app.isPackaged ? path.join(process.resourcesPath, 'controller') : './controller'
  const child = spawn(file)

  child.stdout.on('data', (data) => {
    //console.log(data.toString())
    mainWindow.webContents.send('controller-input', data.toString())
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Handle requests for the custom protocol
  protocol.handle('latte', (request) => {
    const filePath = new URL(request.url).pathname
    // Ensure correct path resolution across platforms
    const absolutePath = path.normalize(filePath)
    return net.fetch(`file://${absolutePath}`)
  })

  setHandles();

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
