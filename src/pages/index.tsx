import Workspace from '../components/workspace'
import { AnimatePresence, motion } from 'framer-motion'
import { useTabs } from '../contexts/tabsContext'
import { useRoute } from '../contexts/routeContext';
import SettingPage from './setting';

function IndexPage() {
    const { tabs } = useTabs();
    const { route } = useRoute();
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layoutId='index-page' key='index-page'>
            <Workspace>
            {
                tabs.map((tab, index) => {
                    return (
                        <div key={index}
                            className={'absolute w-full h-full top-0 left-0 flex items-center justify-center '+(tab.isActive?'':' pointer-events-none')}>
                            <webview
                                className={'w-full h-full '+(tab.isActive?'':' hidden')}
                                src={tab.url}
                                title={tab.name}
                                allowFullScreen
                                partition={tab.id}
                                nodeintegration={false}
                            ></webview>
                        </div>
                    )
                })
            }
            </Workspace>
            <AnimatePresence>
            {
                route === '/setting' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}
                        className='absolute top-[2.4rem] left-0 w-full h-[calc(100%_-_2.4rem)] flex items-center justify-center z-50 bg-(--root-title-background)/40 backdrop-blur-sm p-2'
                        layoutId='setting-page' key='setting-page'>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.16 }}
                            className='w-full h-full flex items-center justify-center bg-(--background) rounded-lg'>
                            <SettingPage />
                        </motion.div>
                    </motion.div>
                )
            }
            </AnimatePresence>
        </motion.div>
    )
}

export default IndexPage