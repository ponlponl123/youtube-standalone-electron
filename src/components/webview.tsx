import { useRef, useEffect, WebViewHTMLAttributes } from 'react'
import { useTabs } from '../contexts/tabsContext';

function WebView(params: WebViewHTMLAttributes<Electron.WebviewTag>) {
    const { setTabWebview, editTab, tabs } = useTabs();
    const tabData = tabs.find((tab) => tab.id === params.partition);

    const localWebviewRef = useRef<Electron.WebviewTag>(null);

    useEffect(() => {
        if (params.partition && localWebviewRef.current) {
            setTabWebview(params.partition, localWebviewRef);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.partition]);

    useEffect(() => {
        const webview = localWebviewRef.current;
        if (!webview || !tabData) return;

        let intervalId: NodeJS.Timeout | null = null;

        const handleDomReady = () => {
            console.log("Webview is ready");

            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(() => {
                // Always get the latest tabData and params.partition
                const currentTabData = tabs.find((tab) => tab.id === params.partition);
                console.log("isCurrentlyAudible", webview.isCurrentlyAudible())
                console.log("isAudioMuted", webview.isAudioMuted())
                if (params.partition && currentTabData) {
                    try {
                        if (webview.isCurrentlyAudible())
                            editTab(params.partition, {
                                ...currentTabData,
                                audible: true
                            });
                        else
                            editTab(params.partition, {
                                ...currentTabData,
                                audible: false
                            });

                        if (webview.isAudioMuted())
                            editTab(params.partition, {
                                ...currentTabData,
                                muted: true
                            });
                        else
                            editTab(params.partition, {
                                ...currentTabData,
                                muted: false
                            });
                    } catch (e) {
                        // Ignore errors if webview is not ready
                    }
                }
            }, 1000);
        };

        const handleDidNavigate = () => {
            if (params.partition && tabData) {
                editTab(params.partition, {
                    ...tabData,
                    url: webview.getURL(),
                    name: webview.getTitle() || tabData.name || ''
                });
            }
        };

        webview.addEventListener('dom-ready', handleDomReady);
        webview.addEventListener('did-navigate', handleDidNavigate);
        webview.addEventListener('page-title-updated', handleDidNavigate);

        return () => {
            webview.removeEventListener('dom-ready', handleDomReady);
            webview.removeEventListener('did-navigate', handleDidNavigate);
            webview.removeEventListener('page-title-updated', handleDidNavigate);
            if (intervalId) clearInterval(intervalId);
        }
    }, [editTab, params.partition, tabData, tabs]);

    return (
        <webview
            ref={localWebviewRef}
            key={params.partition}
            partition={params.partition}
            style={{
                zoom: 0.6,
            }}
            {...params}
            // webpreferences="allowRunningInsecureContent"
            // @ts-expect-error TypeScript doesn't recognize the webview tag
            nodeintegration="false"
        ></webview>
    );
}

export default WebView;