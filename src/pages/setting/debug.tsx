import { motion } from "framer-motion"
import { Info, Toolbox } from "@phosphor-icons/react"
import { motion_style } from "../setting"
import { useLanguage } from "../../contexts/langContext"
import { Button, ScrollShadow } from "@heroui/react";
import { useApp } from "../../contexts/appContext";
import { useRoute } from "../../contexts/routeContext";

function Debug() {
  const { route, previousRoute } = useRoute();
  const { version, os_platform, os_release, isSettingShowed, isPIN, isLocked } = useApp();
  const { language } = useLanguage();
  return (
    <motion.div
      className="w-full h-full flex flex-col gap-3 items-start justify-start"
      variants={motion_style}
      initial={"hidden"}
      animate={"show"}
      exit={"exit"}
    >
      <div className="flex gap-4 mt-4 items-center">
        <Toolbox weight="fill" size={32} />
        <h1 className="text-2xl font-semibold">{language.data.setting.pages.debug.title}</h1>
      </div>
      <span className="text-sm text-foreground/40">{language.data.setting.nav.dev_zone}</span>

      <ScrollShadow className="overflow-y-auto h-full w-full py-4" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--scrollbar-color) transparent'
      }}>
        <div className="flex flex-col gap-2 w-full">
          <table>
            <thead>
              <tr>
                <th>key</th>
                <th>value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="max-w-6">version</td>
                <td>{version}</td>
              </tr>
              <tr>
                <td className="max-w-6">os_platform</td>
                <td>{os_platform}</td>
              </tr>
              <tr>
                <td className="max-w-6">os_release</td>
                <td>{os_release}</td>
              </tr>
              <tr>
                <td className="max-w-6">route</td>
                <td>{route}</td>
              </tr>
              <tr>
                <td className="max-w-6">previousRoute</td>
                <td>{previousRoute}</td>
              </tr>
              <tr>
                <td className="max-w-6">isSettingShowed</td>
                <td>{isSettingShowed}</td>
              </tr>
              <tr>
                <td className="max-w-6">isPIN</td>
                <td>{String(isPIN)}</td>
              </tr>
              <tr>
                <td className="max-w-6">isLocked</td>
                <td>{String(isLocked)}</td>
              </tr>
            </tbody>
          </table>
          <h1 className="mt-4 text-sm font-semibold">DevTools</h1>
          <div className="alert-msg bg-primary/10 p-4 rounded-2xl">
            <h1 className="text-sm flex items-center gap-1 font-semibold"><Info weight="fill" size={18} /> How it's works?</h1>
            <p className="text-xs text-foreground/40 mt-1">So if you want to toggle electron devtools, you need to send ipc message "hey-show-me-dev-tools" to main process</p>
          </div>
          <div className="flex gap-4 items-center">
            <Button color="danger" className="dark:bg-danger/10" onPress={()=>window.ipcRenderer.send("hey-show-me-dev-tools")}>Toggle DevTools</Button>
          </div>
          <h1 className="mt-4 text-sm font-semibold">Buttons</h1>
          <div className="flex gap-2 flex-wrap">
            <Button color="default">Button</Button>
            <Button color="primary">Button</Button>
            <Button color="secondary">Button</Button>
            <Button color="success">Button</Button>
            <Button color="warning">Button</Button>
            <Button color="danger">Button</Button>
          </div>
        </div>
      </ScrollShadow>
      <span className="opacity-40 text-xs">{language.data.setting.clientver}: {version}</span>
    </motion.div>
  )
}

export default Debug