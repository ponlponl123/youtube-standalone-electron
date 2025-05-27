import { useTabs } from '../contexts/tabsContext'
import Workspace from '../components/workspace'
import WebView from '../components/webview';

function IndexPage() {
    const { tabs } = useTabs();
    return (
        <Workspace>
        {
            tabs.map((tab, index) => {
                return (
                    <div key={'browser-tab-container-'+index}
                        className={'absolute w-full h-full top-0 left-0 flex items-center justify-center '+(tab.isActive?'':' pointer-events-none')}>
                        <WebView
                            className={'w-full h-full '+(tab.isActive?'':' hidden')}
                            allowFullScreen
                            partition={tab.id}
                            nodeintegration={false}
                        />
                    </div>
                )
            })
        }
        </Workspace>
    )
}

export default IndexPage