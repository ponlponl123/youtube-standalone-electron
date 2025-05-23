import React from 'react'
import ReactDOM from 'react-dom/client'
import Providers from './Providers.tsx'
import './index.css'
import { AppProvider } from './contexts/appContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <Providers />
    </AppProvider>
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

const themeManager = (value: boolean) => {
  const theme = value ? "dark" : "light";
  window.document.documentElement.setAttribute("data-theme", theme)
  window.document.documentElement.classList.value = theme;
}

window.ipcRenderer.on('theme', (_, value) => themeManager(value))
window.ipcRenderer.invoke('system:theme').then((value) => themeManager(value))