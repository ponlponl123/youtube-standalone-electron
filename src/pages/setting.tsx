import { Button, ScrollShadow } from "@heroui/react"
import { Gear, Minus } from "@phosphor-icons/react"
import { useRoute } from "../contexts/routeContext";

function SettingPage() {
    const { setRoute } = useRoute();
    return (
        <div className="relative flex items-center justify-center w-full h-full" id="setting-page">
            <Button className="absolute top-1 right-1" size="sm" variant="light" isIconOnly
                onPress={()=>{setRoute('/')}}
            ><Minus weight="bold" /></Button>
            <div className="sidebar-container w-56 h-full group/container p-6 transition-all duration-300">
                <h1 className="text-base font-medium flex items-center gap-2"><Gear className="min-w-max" size={18} weight="fill" /> Setting</h1>
                <div className="sidebar-content tabs-container flex flex-col gap-1 mt-2 w-full h-full">
                    <ScrollShadow className="sidebar-tabs overflow-y-auto h-full w-full">
                        <Button className="tab-item active" onPress={() => { setRoute('/setting/general') }}>
                            <span className="tab-title">General</span>
                        </Button>
                        <Button className="tab-item" onPress={() => { setRoute('/setting/advanced') }}>
                            <span className="tab-title">Advanced</span>
                        </Button>
                        <Button className="tab-item" onPress={() => { setRoute('/setting/about') }}>
                            <span className="tab-title">About</span>
                        </Button>
                        <Button className="tab-item" onPress={() => { setRoute('/setting/feedback') }}>
                            <span className="tab-title">Feedback</span>
                        </Button>
                        <Button className="tab-item" onPress={() => { setRoute('/setting/shortcut') }}>
                            <span className="tab-title">Shortcut</span>
                        </Button>
                        <Button className="tab-item" onPress={() => { setRoute('/setting/equalizer') }}>
                            <span className="tab-title">Equalizer</span>
                        </Button>
                    </ScrollShadow>
                </div>
            </div>
            <div className="content-container flex-1 flex min-w-0 h-full overflow-hidden">
                <ScrollShadow className="sidebar-tabs overflow-y-auto h-full w-full" style={{
                    scrollbarColor: 'var(--scrollbar-color) transparent',
                    scrollbarWidth: 'thin'
                }}>
                    
                </ScrollShadow>
            </div>
        </div>
    )
}

export default SettingPage