import { RouteProvider } from './contexts/routeContext'
import { HeroUIProvider } from '@heroui/react'
import Layout from './layout'
import { ThemeProvider } from './contexts/themeContext'
import { TabsProvider } from './contexts/tabsContext'
import { LanguageProvider } from './contexts/langContext'

function Providers() {
  return (
    <RouteProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TabsProvider>
            <HeroUIProvider>
              <Layout />
            </HeroUIProvider>
          </TabsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </RouteProvider>
  )
}

export default Providers