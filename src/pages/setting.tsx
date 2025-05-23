import { Button, Link, ScrollShadow } from "@heroui/react"
import { Gear, Minus } from "@phosphor-icons/react"
import { useApp } from "../contexts/appContext";
import { AnimatePresence, motion } from "framer-motion";
import Language from "./setting/language";
import NotFound from "./setting/notFound";
import { useLanguage } from "../contexts/langContext";

function SettingNavBtn({ children, href }: { children: React.ReactNode, href?: string }) {
    const { showSetting, isSettingShowed } = useApp();
    return (
        <Button
            className="flex justify-start"
            onPress={() => href ? showSetting(href) : undefined}
            variant={ isSettingShowed === href ? "solid" : "light" }
        >
            {children}
        </Button>
    )
}

export const motion_style = {
    hidden: {
        y: 32,
        opacity: 0
    },
    show: {
        y: 0,
        opacity: 1
    },
    edit: {
        y: -32,
        opacity: 0
    }
}

function SettingPage() {
    const { language } = useLanguage();
    const { showSetting, isSettingShowed, version, os_platform, os_release } = useApp();
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, delay: 0.24 }}
            className="relative w-full h-full flex items-center justify-center"
            id="setting-page"
        >
            <Button className="absolute top-1 right-1" size="sm" variant="light" isIconOnly onPress={()=>showSetting("")}><Minus weight="bold" /></Button>
            <div className="flex items-center justify-center w-full max-w-5xl h-full">
                <div className="w-44 md:w-56 lg:w-72 h-full p-6 transition-all duration-300">
                    <h1 className="text-base font-medium flex items-center gap-2"><Gear className="min-w-max" size={18} weight="fill" /> {language.data.setting.title}</h1>
                    <div className="sidebar-content tabs-container flex flex-col gap-1 mt-4 w-full h-[calc(100%_-_2rem)]">
                        <ScrollShadow className="sidebar-tabs overflow-y-auto h-full w-full" style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'var(--scrollbar-color) transparent'
                        }}>
                            <div className="flex flex-col gap-2">
                                <SettingNavBtn href="/">{language.data.setting.pages.general.title}</SettingNavBtn>
                                <SettingNavBtn href="/appearance">{language.data.setting.pages.appearance.title}</SettingNavBtn>
                                <SettingNavBtn href="/update">{language.data.setting.pages.update.title}</SettingNavBtn>

                                <strong className="text-xs mt-2 opacity-40 px-2">{language.data.setting.nav.enhancement}</strong>
                                    <SettingNavBtn href="/video">{language.data.setting.pages.video.title}</SettingNavBtn>
                                    <SettingNavBtn href="/sound">{language.data.setting.pages.sound.title}</SettingNavBtn>

                                <strong className="text-xs mt-2 opacity-40 px-2">{language.data.setting.nav.accessibility}</strong>
                                    <SettingNavBtn href="/language">{language.data.setting.pages.language.title}</SettingNavBtn>
                                    <SettingNavBtn href="/shortcut">{language.data.setting.pages.shortcut.title}</SettingNavBtn>

                                <strong className="text-xs mt-2 opacity-40 px-2">{language.data.setting.nav.dev_zone}</strong>
                                    <SettingNavBtn href="/debug">{language.data.setting.pages.debug.title}</SettingNavBtn>
                                    <Link className="contents" href="https://github.com/ponlponl123/youtube-standalone-electron/discussions/new?category=ideas" target="_blank">
                                        <SettingNavBtn>{language.data.setting.pages.feedback.title}</SettingNavBtn>
                                    </Link>

                                <div className="flex flex-col gap-1 py-2 px-4 text-xs text-foreground/40">
                                    <span>{version}</span>
                                    <span>{os_platform} ({os_release})</span>
                                </div>
                            </div>
                        </ScrollShadow>
                    </div>
                </div>
                <div className="content-container flex-1 flex min-w-0 h-full overflow-hidden">
                    <ScrollShadow className="sidebar-tabs overflow-y-auto h-full w-full p-4 pb-12" style={{
                        scrollbarColor: 'var(--scrollbar-color) transparent',
                        scrollbarWidth: 'thin'
                    }}>
                        <AnimatePresence>
                        {
                            isSettingShowed === "/language" ?
                            <Language />
                            : <NotFound />
                        }
                        </AnimatePresence>
                    </ScrollShadow>
                </div>
            </div>
        </motion.div>
    )
}

export default SettingPage