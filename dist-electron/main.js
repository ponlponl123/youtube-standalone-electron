import { BrowserWindow, app, ipcMain, nativeTheme, shell } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
function handleSetTitle(event, title) {
  const webContents = event.sender;
  const win2 = BrowserWindow.fromWebContents(webContents);
  if (win2) win2.setTitle(title);
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      devTools: process.env.NODE_ENV !== "production",
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      webviewTag: true
    },
    titleBarStyle: "hidden",
    minWidth: 600,
    minHeight: 400
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.on("blur", () => {
    win == null ? void 0 : win.webContents.send("blur", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.on("focus", () => {
    win == null ? void 0 : win.webContents.send("focus", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.on("maximize", () => {
    win == null ? void 0 : win.webContents.send("maximize", true);
  });
  win.on("unmaximize", () => {
    win == null ? void 0 : win.webContents.send("maximize", false);
  });
  win.on("enter-full-screen", () => {
    win == null ? void 0 : win.webContents.send("fullscreen", true);
  });
  win.on("leave-full-screen", () => {
    win == null ? void 0 : win.webContents.send("fullscreen", false);
  });
  nativeTheme.on("updated", () => {
    win == null ? void 0 : win.webContents.send("theme", nativeTheme.shouldUseDarkColors);
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("file://")) {
      return { action: "allow" };
    }
    shell.openExternal(url);
    return { action: "deny" };
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.whenReady().then(() => {
  ipcMain.on("set-title", handleSetTitle);
  ipcMain.on("maximize", (_, value) => {
    if (value)
      win == null ? void 0 : win.maximize();
    else
      win == null ? void 0 : win.unmaximize();
  });
  ipcMain.on("minimize", () => {
    win == null ? void 0 : win.minimize();
  });
  ipcMain.on("exit", () => {
    app.quit();
  });
  ipcMain.on("close", () => {
    win == null ? void 0 : win.close();
  });
  ipcMain.on("reload", () => {
    win == null ? void 0 : win.reload();
  });
  ipcMain.on("fullscreen", (_, value) => {
    if (value)
      win == null ? void 0 : win.setFullScreen(true);
    else
      win == null ? void 0 : win.setFullScreen(false);
  });
  ipcMain.handle("isMaximized", () => {
    return win == null ? void 0 : win.isMaximized();
  });
  ipcMain.handle("system:theme", () => {
    return nativeTheme.shouldUseDarkColors;
  });
  ipcMain.handle("app:fullscreen", () => {
    return win == null ? void 0 : win.isFullScreen();
  });
  ipcMain.handle("app:focused", () => {
    return win == null ? void 0 : win.isFocused();
  });
});
app.on("before-quit", () => {
  ipcMain.removeHandler("isMaximized");
  ipcMain.removeAllListeners("maximize");
  ipcMain.removeAllListeners("minimize");
  ipcMain.removeAllListeners("close");
  ipcMain.removeAllListeners("reload");
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
