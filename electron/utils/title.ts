import { BrowserWindow, IpcMainEvent } from "electron"

export function handleSetTitle (event: IpcMainEvent, title: string) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    if (win) win.setTitle(title)
}