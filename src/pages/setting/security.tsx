import { motion } from "framer-motion"
import { Password, Shield } from "@phosphor-icons/react"
import { motion_style } from "../setting"
import { useLanguage } from "../../contexts/langContext"
import { Button, InputOtp, ScrollShadow } from "@heroui/react";
import { useApp } from "../../contexts/appContext";
import { useState } from "react";

function Security() {
  const { language } = useLanguage();
  const { isPIN } = useApp();
  const [ PINState, setPINState ] = useState<number>(0);
  return (
    <motion.div
      className="w-full h-full flex flex-col gap-3 items-start justify-start"
      variants={motion_style}
      initial={"hidden"}
      animate={"show"}
      exit={"exit"}
    >
      <div className="flex gap-4 mt-4 items-center">
        <Shield weight="fill" size={32} />
        <h1 className="text-2xl font-semibold">{language.data.setting.pages.security.title}</h1>
      </div>
      <span className="text-sm text-foreground/40">{language.data.setting.pages.security.description}</span>

      <ScrollShadow className="overflow-y-auto h-full w-full py-4" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--scrollbar-color) transparent'
      }}>
        <div className="flex flex-col gap-2 w-full">
          <section className="p-6 rounded-3xl border-2 border-foreground/5 flex flex-col gap-2 w-full mt-4">
            <div className="flex gap-2 items-center">
              <Password weight="fill" size={24} />
              <h1 className="text-lg font-semibold">{language.data.setting.pages.security.sections.pin.title}</h1>
            </div>
            <span className="text-sm text-foreground/40">{language.data.setting.pages.security.sections.pin.description}</span>
            <div className="flex flex-wrap gap-4 mt-2 items-center">
              {
                isPIN ?
                  <Button onPress={()=>setPINState(401)} color="danger" className="dark:bg-danger/10">{language.data.setting.pages.security.sections.pin.state.enabled.actions.disable}</Button>
                : PINState===0 ? <>
                  <Button onPress={()=>setPINState(1)} color="danger" className="dark:bg-danger/10">{language.data.setting.pages.security.sections.pin.state.disabled.actions.enable}</Button>
                </> : PINState===1 ? <>
                  <div className="flex flex-col w-full">
                    <InputOtp length={4} radius="full" size="sm" type="password" variant="bordered"
                      classNames={{
                        segment: "bg-transparent"
                      }}
                    />
                  </div>
                  <Button onPress={()=>setPINState(2)} color="danger" className="dark:bg-danger/10">{language.data.setting.pages.security.sections.pin.state.setup.actions.confirm}</Button>
                  <Button onPress={()=>setPINState(0)} color="default" className="dark:bg-default/10">{language.data.setting.pages.security.sections.pin.state.setup.actions.cancel}</Button>
                </> : <span>Unknown State</span>
              }
            </div>
          </section>
        </div>
      </ScrollShadow>
    </motion.div>
  )
}

export default Security