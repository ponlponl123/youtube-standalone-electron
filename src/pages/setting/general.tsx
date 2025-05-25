import { motion } from "framer-motion"
import { YoutubeLogoIcon } from "@phosphor-icons/react"
import { motion_style } from "../setting"
import { useLanguage } from "../../contexts/langContext"
import { ScrollShadow } from "@heroui/react";
import { useApp } from "../../contexts/appContext";

function General() {
  const { version } = useApp();
  const { language } = useLanguage();
  return (
    <motion.div
      className="w-full h-full flex flex-col gap-3 items-center justify-start"
      variants={motion_style}
      initial={"hidden"}
      animate={"show"}
      exit={"exit"}
    >
      <div className="flex flex-col gap-2 mt-12 items-center">
        <YoutubeLogoIcon size={48} weight="fill" />
        <h1 className="text-2xl text-center font-semibold">{language.data.root_.title}</h1>
      </div>
      <span className="text-sm text-center max-w-xl text-foreground/40">{language.data.root_.description}</span>

      <ScrollShadow className="overflow-y-auto h-full w-full py-4" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--scrollbar-color) transparent'
      }}>
        <div className="flex flex-col gap-2 w-full">
          
        </div>
      </ScrollShadow>
      <span className="opacity-40 text-xs">{language.data.setting.clientver}: {version}</span>
    </motion.div>
  )
}

export default General