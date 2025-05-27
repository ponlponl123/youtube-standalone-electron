import './App.css'
import { useEffect, useState } from 'react';
import { useApp } from './contexts/appContext';
import { useRoute } from './contexts/routeContext';
import { AnimatePresence, motion } from 'framer-motion';
import IndexPage from './pages';
import Setup from './pages/setup';
import NotFoundPage from './pages/notFound';
import Offline from './pages/offline';
import SettingPage from './pages/setting';

function App() {
  const { route } = useRoute();
  const { isSettingShowed } = useApp();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => { setIsOnline(true) })
    window.addEventListener("offline", () => { setIsOnline(false) })
  }, [isOnline])

  let PageComponent;
  if (route === '/')
    isOnline ? PageComponent = IndexPage : PageComponent = Offline;
  else if (route === '/setup')
    PageComponent = Setup;
  else
    PageComponent = NotFoundPage;

  return <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layoutId={route} key={route}>
      <PageComponent />
      <AnimatePresence key={"setting-panel-container"}>
        {
          isSettingShowed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.32 }}
              className='absolute top-[2.4rem] left-0 w-full h-[calc(100%_-_2.4rem)] flex items-center justify-center z-50 bg-(--root-title-background)/40 backdrop-blur-lg backdrop-saturate-150 p-2'
              layoutId='setting-page' key='setting-page'>
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.32 }}
                className='w-full h-full flex items-center justify-center bg-(--background)/90 rounded-lg overflow-hidden'>
                <SettingPage />
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence>
    </motion.div>
  </>;
}

export default App
