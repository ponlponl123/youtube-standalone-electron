import { Plus, X } from '@phosphor-icons/react';
import { useTabs } from '../contexts/tabsContext'
import { Button, ScrollShadow } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion';

function Sidebar() {
    const { tabs, addTab, removeTab, setActiveTab } = useTabs();
    return (
        <div className='sidebar-container w-8 group/container hover:w-48 hover:bg-(--background) rounded-md ml-2 mb-2 py-1 hover:px-1 transition-all duration-300'>
            <ScrollShadow className='sidebar-tabs overflow-y-auto h-full w-full' style={{
                scrollbarColor: 'var(--scrollbar-color) transparent',
            }}>
                <div className='sidebar-content tabs-container flex flex-col gap-1'>
                    <AnimatePresence>
                        {
                            tabs.map((tab, index) => {
                                return (
                                <div className='tab-item-container-wrapper flex-1 flex max-h-8 overflow-hidden' key={index}>
                                    <motion.div layoutId={tab.id} initial={{ opacity: 0, marginTop: -32 }} animate={{ opacity: 1, marginTop: 0 }} exit={{ opacity: 0, marginTop: -32 }} className='tab-item-container flex-1 flex max-h-8'>
                                        <Button className={'tab-item max-h-8 '+(tab.isActive?' active':'')} onPress={() => {
                                            setActiveTab(tab.id);
                                        }}>
                                            <img src={tab.icon} alt={tab.name} />
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
                        <Plus className='min-w-4' size={32} />
                        <span className='tab-title'>New tab</span>
                    </Button>
                </div>
            </ScrollShadow>
        </div>
    )
}

export default Sidebar