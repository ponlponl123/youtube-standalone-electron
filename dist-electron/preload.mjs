"use strict";
const electron = require("electron");
console.log("Made with ❤️ by Community!");
console.log("Seem like you are looking at devtools?, if you see any bugs or you want to do something interesting, Feel free to open an issue or PR on GitHub!");
console.log("https://github.com/ponlponl123/youtube-standalone-electron");
electron.ipcRenderer.invoke("app:version").then((version) => {
  window.appVersion = version;
  console.log("app version", version);
});
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
