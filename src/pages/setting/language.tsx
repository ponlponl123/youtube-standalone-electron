import { motion } from "framer-motion"
import { Translate } from "@phosphor-icons/react"
import { motion_style } from "../setting"
import { useLanguage } from "../../contexts/langContext"
import { Avatar, cn, Radio, RadioGroup, ScrollShadow } from "@heroui/react";
import { languages } from "../../utils/i18n";
import React from "react";

function Language() {
  const { language, setLanguage } = useLanguage();
  const selectedLanguage = React.useMemo(()=>language.key,[language]);
  return (
    <motion.div
      className="w-full h-full flex flex-col gap-3 items-start justify-start"
      variants={motion_style}
      initial={"hidden"}
      animate={"show"}
      exit={"exit"}
    >
      <div className="flex gap-4 mt-4 items-center">
        <Translate size={32} />
        <h1 className="text-2xl font-semibold">{language.data.setting.pages.language.title}</h1>
      </div>
      <span className="text-sm text-foreground/40">{language.data.setting.pages.language.description}</span>

      <ScrollShadow className="overflow-y-auto h-full w-full py-4" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--scrollbar-color) transparent'
      }}>
        <div className="flex flex-col gap-2 w-full">
          <RadioGroup className="w-full"
            value={selectedLanguage} onValueChange={setLanguage}>
          {
            languages.map((lang, index) => {
              return (
                <Radio
                  key={"setting-selector-lang-"+index}
                  classNames={{
                    base: cn(
                      "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                      "flex-row-reverse max-w-none cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                      "data-[selected=true]:border-danger",
                    ),
                  }}
                  color="danger"
                  value={lang.key}
                >
                  <div className="w-full flex items-center gap-4">
                    <Avatar alt={lang.name} className="w-6 h-5"
                      radius="sm"
                      src={`/flags/${lang.flag}.svg`} />
                    {lang.locate}
                  </div>
                </Radio>
              )
            })
          }
          </RadioGroup>
        </div>
      </ScrollShadow>
    </motion.div>
  )
}

export default Language