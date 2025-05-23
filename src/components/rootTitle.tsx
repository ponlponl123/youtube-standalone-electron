import React from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react'
import { CopySimpleIcon, Gear, GitPullRequest, HandWaving, House, List, Minus, Moon, Square, Sun, Warning, Wrench, X } from '@phosphor-icons/react'
import { useRoute } from '../contexts/routeContext'
import { useTheme } from '../contexts/themeContext'
import { useApp } from '../contexts/appContext'
import { useLanguage } from '../contexts/langContext'

function RootTitle() {
    const [ isMaximized, setMaximized ] = React.useState(false)
    const { setRoute } = useRoute();
    const { theme, setTheme } = useTheme();
    const { version, showSetting } = useApp();
    const { language } = useLanguage();

    React.useEffect(() => {
        window.ipcRenderer.invoke('isMaximized').then((res: boolean) => {
            setMaximized(res)
        })
        window.ipcRenderer.on('maximize', (_event, isMaximized: boolean) => {
            setMaximized(isMaximized)
        })
    }, [])

    return (
        <header className='' id='root-title'>
            <div id='root-title-left'>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant='light' isIconOnly><List weight='bold' size={14} /></Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" variant="flat">
                        <DropdownSection title={language.data.root_.tools.main.name.replace("{version}", version)}>
                            <DropdownItem startContent={<House weight='fill' size={16} />}
                                key="home" onPress={() => setRoute('/')}>{language.data.root_.tools.main.actions.home}</DropdownItem>
                            <DropdownItem startContent={<Wrench weight='fill' size={16} />}
                                key="setup" onPress={() => setRoute('/setup')}>{language.data.root_.tools.main.actions.setup}</DropdownItem>
                        </DropdownSection>
                        <DropdownSection title={language.data.root_.tools.config.name}>
                            <DropdownItem startContent={<Gear weight='fill' size={16} />}
                                key="setting" onPress={() => showSetting('/')}>{language.data.root_.tools.config.actions.setting}</DropdownItem>
                            {
                                theme === 'dark' ? <DropdownItem startContent={<Sun weight='fill' size={16} />}
                                    key="theme-light" onPress={() => setTheme('light')}>{language.data.root_.tools.config.actions.theme.title.replace("{mode}", language.data.root_.tools.config.actions.theme.light)}</DropdownItem> :
                                <DropdownItem startContent={<Moon weight='fill' size={16} />}
                                    key="theme-dark" onPress={() => setTheme('dark')}>{language.data.root_.tools.config.actions.theme.title.replace("{mode}", language.data.root_.tools.config.actions.theme.dark)}</DropdownItem>
                            }
                        </DropdownSection>
                        <DropdownSection title={language.data.root_.tools.help.name}>
                            <DropdownItem href='https://github.com/ponlponl123/youtube-standalone-electron/issues/new/choose' target='_blank'
                                startContent={<Warning weight='fill' size={16} />}
                                key="create-issue">{language.data.root_.tools.help.actions.issue}</DropdownItem>
                            <DropdownItem href='https://github.com/ponlponl123/youtube-standalone-electron/compare' target='_blank'
                                startContent={<GitPullRequest weight='fill' size={16} />}
                                key="create-pr">{language.data.root_.tools.help.actions.pr}</DropdownItem>
                        </DropdownSection>
                        <DropdownSection title={language.data.root_.tools.danger.name}>
                            <DropdownItem startContent={<HandWaving weight='fill' size={16} />}
                                onPress={()=>{
                                    window.ipcRenderer.send('exit')
                                }}
                                key="exit" className="text-danger" color="danger">{language.data.root_.tools.danger.actions.terminate}</DropdownItem>
                        </DropdownSection>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div id='root-title-center'>
                <div id='app-region'></div>
                <div id='root-title-center-container'>
                    <div id='root-title-center-logo'>
                        <img src='/favicon_32x32.png' alt='Youtube' />
                    </div>
                    <div id='root-title-center-name'>
                        <h1>{language.data.root_.title}</h1>
                    </div>
                </div>
            </div>
            <div id='root-title-actions'>
                <Button variant='light' isIconOnly onPress={()=>{
                    window.ipcRenderer.send('close')
                }}><X weight='bold' size={14} /></Button>
                <Button variant='light' isIconOnly onPress={()=>{
                    window.ipcRenderer.invoke('isMaximized').then((res: boolean) => {
                        if (res) {
                            window.ipcRenderer.send('maximize', false)
                        } else {
                            window.ipcRenderer.send('maximize', true)
                        }
                    })
                }}>{
                    isMaximized ? <CopySimpleIcon weight='bold' size={12} /> : <Square weight='bold' size={12} />
                }</Button>
                <Button variant='light' isIconOnly onPress={()=>{
                    window.ipcRenderer.send('minimize')
                }}><Minus weight='bold' size={12} /></Button>
            </div>
        </header>
    )
}

export default RootTitle