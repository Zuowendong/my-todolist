import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { writeFile, getAllFileName, readFile } from './file'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 666,
    height: 500,
    show: false,
    // alwaysOnTop: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    icon: icon
  })

  ipcMain.on('dialog:openFile', (_, path) => {
    shell.openPath(path)
  })
  ipcMain.handle('dialog:changeFile', handleFileOpen)

  ipcMain.on('exportFile', (_, data) => {
    // const { fileUrl, time } = data
    // const filePath = join(fileUrl, `${time}.txt`)
    writeFile(data)
    // shell.openPath(filePath)
  })
  ipcMain.on('readFileNames', (event, data) => {
    let res = getAllFileName(data)
    event.sender.send('fileNames', res)
  })
  ipcMain.on('readFile', (event, path) => {
    console.log('🔥🔥🔥🔥🔥🔥', path)

    readFile(path).then((res) => {
      console.log('🔥🔥🔥🔥🔥🔥', res)

      event.sender.send('fileContent', res)
    })
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  console.log('init')

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: '选择待办日志文件夹',
    properties: ['openDirectory']
  })
  if (canceled) {
    console.log('canceled')
    return
  } else {
    return filePaths[0]
  }
}
