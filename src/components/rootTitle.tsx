import React from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/react'
import { CopySimpleIcon, Gear, GitPullRequest, HandWaving, House, List, Minus, Moon, Square, Sun, Warning, Wrench, X } from '@phosphor-icons/react'
import { useRoute } from '../contexts/routeContext'
import { useTheme } from '../contexts/themeContext'

function RootTitle() {
    const [ isMaximized, setMaximized ] = React.useState(false)
    const { setRoute } = useRoute();
    const { theme, setTheme } = useTheme();

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
                        <DropdownSection title="Current Version: dev-0.1.0">
                            <DropdownItem startContent={<House weight='fill' size={16} />}
                                key="home" onPress={() => setRoute('/')}>Home</DropdownItem>
                            <DropdownItem startContent={<Wrench weight='fill' size={16} />}
                                key="setup" onPress={() => setRoute('/setup')}>App Setup</DropdownItem>
                            <DropdownItem startContent={<Gear weight='fill' size={16} />}
                                key="setting" onPress={() => setRoute('/setting')}>Setting</DropdownItem>
                            {
                                theme === 'dark' ? <DropdownItem startContent={<Sun weight='fill' size={16} />}
                                    key="theme-light" onPress={() => setTheme('light')}>Light Mode</DropdownItem> :
                                <DropdownItem startContent={<Moon weight='fill' size={16} />}
                                    key="theme-dark" onPress={() => setTheme('dark')}>Dark Mode</DropdownItem>
                            }
                        </DropdownSection>
                        <DropdownSection title="Github">
                            <DropdownItem href='https://github.com/ponlponl123/youtube-standalone-electron/issues/new/choose' target='_blank'
                                startContent={<Warning weight='fill' size={16} />}
                                key="create-issue">Create Issue</DropdownItem>
                            <DropdownItem href='https://github.com/ponlponl123/youtube-standalone-electron/compare' target='_blank'
                                startContent={<GitPullRequest weight='fill' size={16} />}
                                key="create-pr">Make Pull request</DropdownItem>
                        </DropdownSection>
                        <DropdownSection title="Danger zone">
                            <DropdownItem startContent={<HandWaving weight='fill' size={16} />}
                                onPress={()=>{
                                    window.ipcRenderer.send('exit')
                                }}
                                key="exit" className="text-danger" color="danger">Exit</DropdownItem>
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
                        <h1>Youtube (Standalone)</h1>
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