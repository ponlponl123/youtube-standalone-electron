import React from 'react';
import { useTabs } from '../contexts/tabsContext'
import { Button, ScrollShadow } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, PushPin, PushPinSlash, SpeakerSimpleHigh, SpeakerSimpleX, X } from '@phosphor-icons/react';

function Sidebar() {
    const [ lock, setLock ] = React.useState(false);
    const { tabs, addTab, editTab, removeTab, setActiveTab } = useTabs();
    return (
        <div
            data-pinned={lock}
            className='sidebar-container w-8 group/container rounded-lg ml-2 mb-2 py-1 transition-all duration-300 flex flex-col gap-1'>
            <ScrollShadow className='sidebar-tabs overflow-y-auto min-h-0 flex-1 w-full' style={{
                scrollbarColor: 'var(--scrollbar-color) transparent',
            }}>
                <div className='sidebar-content tabs-container flex flex-col gap-1'>
                    <AnimatePresence key={"tabs-animate-presence-container"}>
                        {
                            tabs.map((tab, index) => {
                                return (
                                <div className='tab-item-container-wrapper flex-1 flex max-h-8 overflow-hidden' key={'tab-item-'+index}>
                                    <motion.div layoutId={tab.id} initial={{ opacity: 0, marginTop: -32 }} animate={{ opacity: 1, marginTop: 0 }} exit={{ opacity: 0, marginTop: -32 }} className='tab-item-container flex-1 flex max-h-8'>
                                        <Button className={'tab-item max-h-8 '+(tab.isActive?' active':'')} onPress={() => {
                                            setActiveTab(tab.id);
                                        }}>
                                            <div className='tab-icon relative'>
                                                {
                                                    tab.audible ?
                                                    <motion.div
                                                        initial={{ opacity:0 }}
                                                        animate={{ opacity:1 }}
                                                        exit={{ opacity:0 }}
                                                        className='tab-badge absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center'
                                                        layoutId={'playing-'+tab.id}>
                                                        <Button
                                                            isIconOnly
                                                            size='sm'
                                                            onPress={()=>{
                                                                editTab(tab.id, {
                                                                    ...tab,
                                                                    muted: !tab.muted
                                                                })
                                                            }}
                                                            variant='light'
                                                            className='min-h-0 min-w-0 w-6 h-6 absolute flex justify-center items-center'
                                                        >{ tab.muted ?
                                                            <SpeakerSimpleHigh size={12} className='w-max' /> :
                                                            <SpeakerSimpleX size={12} className='w-max' />
                                                        }</Button>
                                                    </motion.div>
                                                    : <img src={tab.icon} alt={tab.name} />
                                                }
                                            </div>
                                            <ScrollShadow className='tab-title w-[calc(100%_-_4rem)] text-start overflow-hidden' orientation='horizontal'>
                                                <span className=''>{tab.name}</span>
                                            </ScrollShadow>
                                            <Button variant='light' size='sm' radius='lg' isIconOnly onPress={() => removeTab(tab.id)} className='remove-tab-button'><X weight='bold' size={12} /></Button>
                                        </Button>
                                    </motion.div>
                                </div>
                                )
                            })
                        }
                    </AnimatePresence>
                    <hr className='opacity-10 my-1' />
                    <Button
                        onPress={() => addTab("https://youtube.com/")}
                        className={'tab-item active !bg-transparent'}
                    >
                        <div className='tab-icon relative'><Plus className='min-w-4' size={32} /></div>
                        <span className='tab-title'>New tab</span>
                    </Button>
                </div>
            </ScrollShadow>
            <div className='flex items-center h-max w-full tabs-container'>
                <Button
                    size='sm'
                    onPress={() => setLock((value) => !value)}
                    className={'tab-item active !bg-transparent'}
                >
                {
                    lock ? <>
                        <div className='tab-icon relative'><PushPinSlash className='min-w-4' size={32} /></div>
                        <span className='tab-title'>Unpin pane</span>
                    </> : <>
                        <div className='tab-icon relative'><PushPin className='min-w-4' size={32} /></div>
                        <span className='tab-title'>Pin pane</span>
                    </>
                }
                </Button>
            </div>
        </div>
    )
}

export default Sidebar