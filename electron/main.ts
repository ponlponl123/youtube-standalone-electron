import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { handleSetTitle } from './utils/title'

// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      devTools: process.env.NODE_ENV !== 'production',
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      webviewTag: true,
    },
    titleBarStyle: 'hidden',
    minWidth: 600,
    minHeight: 400,
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  win.webContents.on('blur', ()=>{
    win?.webContents.send('blur', (new Date).toLocaleString())
  })
  win.webContents.on('focus', ()=>{
    win?.webContents.send('focus', (new Date).toLocaleString())
  })

  win.on('maximize', ()=>{
    win?.webContents.send('maximize', true)
  })
  win.on('unmaximize', ()=>{
    win?.webContents.send('maximize', false)
  })

  win.on('enter-full-screen', ()=>{
    win?.webContents.send('fullscreen', true)
  })
  win.on('leave-full-screen', ()=>{
    win?.webContents.send('fullscreen', false)
  })

  nativeTheme.on('updated', ()=> {
    win?.webContents.send('theme', nativeTheme.shouldUseDarkColors)
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    // config.fileProtocol is my custom file protocol
    if (url.startsWith('file://')) {
        return { action: 'allow' };
    }
    // open url in a browser and prevent default
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.on('maximize', (_, value: boolean) => {
    if (value)
      win?.maximize()
    else
      win?.unmaximize()
  })
  ipcMain.on('minimize', () => {
    win?.minimize()
  })
  ipcMain.on('exit', ()=>{
    app.quit()
  })
  ipcMain.on('close', () => {
    win?.close()
  })
  ipcMain.on('reload', () => {
    win?.reload()
  })
  ipcMain.on('fullscreen', (_, value: boolean) => {
    if (value)
      win?.setFullScreen(true)
    else
      win?.setFullScreen(false)
  })
  ipcMain.handle('isMaximized', () => {
    return win?.isMaximized()
  })
  ipcMain.handle('system:theme', () => {
    return nativeTheme.shouldUseDarkColors
  })
  ipcMain.handle('app:fullscreen', () => {
    return win?.isFullScreen()
  })
  ipcMain.handle('app:focused', () => {
    return win?.isFocused()
  })
})

app.on('before-quit', () => {
  ipcMain.removeHandler('isMaximized')
  ipcMain.removeAllListeners('maximize')
  ipcMain.removeAllListeners('minimize')
  ipcMain.removeAllListeners('close')
  ipcMain.removeAllListeners('reload')
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
