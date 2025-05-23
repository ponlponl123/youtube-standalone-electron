import { motion } from "framer-motion"
import { SmileySad } from "@phosphor-icons/react"
import { motion_style } from "../setting"
import { useLanguage } from "../../contexts/langContext";

function NotFound() {
  const { language } = useLanguage();
  return (
    <motion.div
        className="w-full h-full flex flex-col gap-3 items-center justify-center"
        variants={motion_style}
        initial={"hidden"}
        animate={"show"}
        exit={"exit"}
    >
        <SmileySad weight="fill" size={48} />
        <h1 className="text-2xl">{language.data.setting.pages.notFound.title}</h1>
        <span>{language.data.setting.pages.notFound.description}</span>
    </motion.div>
  )
}

export default NotFound