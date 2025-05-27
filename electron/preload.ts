import { ipcRenderer, contextBridge } from 'electron'

declare global {
  interface Window {
    appVersion: string;
  }
}

console.log('Made with ❤️ by Community!');
console.log('Seem like you are looking at devtools?, if you see any bugs or you want to do something interesting, Feel free to open an issue or PR on GitHub!');
console.log('https://github.com/ponlponl123/youtube-standalone-electron');

// Listen for the 'app-version' event and set window.appVersion to the received version string
ipcRenderer.invoke('app:version').then(version => {
  window.appVersion = version;
  console.log('app version', version);
});

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

// --------------------- Equalizer