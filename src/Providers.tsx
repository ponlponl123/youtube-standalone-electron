import { RouteProvider } from './contexts/routeContext'
import { HeroUIProvider } from '@heroui/react'
import Layout from './layout'
import { ThemeProvider } from './contexts/themeContext'
import { TabsProvider } from './contexts/tabsContext'

function Providers() {
  return (
    <RouteProvider>
        <ThemeProvider>
            <TabsProvider>
                <HeroUIProvider>
                    <Layout />
                </HeroUIProvider>
            </TabsProvider>
        </ThemeProvider>
    </RouteProvider>
  )
}

export default Providers