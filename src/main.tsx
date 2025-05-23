import React from 'react'
import ReactDOM from 'react-dom/client'
import Providers from './Providers.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})

window.ipcRenderer.on('blur', () => {
  window.document.documentElement.setAttribute("focus", "false")
})
window.ipcRenderer.on('focus', () => {
  window.document.documentElement.setAttribute("focus", "true")
})
window.ipcRenderer.invoke('app:focused').then((value)=>{
  window.document.documentElement.setAttribute("focus", value)
})