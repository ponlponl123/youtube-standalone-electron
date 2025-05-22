import React, { useRef, useEffect, WebViewHTMLAttributes } from 'react'
import { useTabs } from '../contexts/tabsContext';

function WebView(params: WebViewHTMLAttributes<Electron.WebviewTag>) {    const { setTabWebview, editTab, getTab } = useTabs();
    const tabData = React.useMemo(() => params.partition ? getTab(params.partition) : undefined, [getTab, params.partition]);
    const isReady = useRef(false);
    const localWebviewRef = useRef<Electron.WebviewTag>(null);
    const setupComplete = useRef(false);
    
    // Handle webview reference setup once
    useEffect(() => {
        if (!params.partition || setupComplete.current) return;
        
        const webview = localWebviewRef.current;
        if (!webview) return;

        // Don't set if reference is already correct
        if (tabData?.webview?.current !== webview) {
            setupComplete.current = true;
            setTabWebview(params.partition, localWebviewRef);
        }

        return () => {
            setupComplete.current = false;
        };
    }, [params.partition, setTabWebview, tabData?.webview]);const handleDomReady = React.useCallback(() => {
        console.log("Webview is ready");
        isReady.current = true;
    }, []);

    const checkAudioState = React.useCallback((webview: Electron.WebviewTag) => {
        if (!isReady.current || !params.partition || !tabData) return;
        try {
            const isAudible = webview.isCurrentlyAudible();
            const isMuted = webview.isAudioMuted();
            
            if (tabData.audible !== isAudible || tabData.muted !== isMuted) {
                editTab(params.partition, {
                    ...tabData,
                    id: tabData.id,  // Ensure id is included
                    audible: isAudible,
                    muted: isMuted
                });
            }
        } catch (e) {
            console.debug('Ignoring webview state check error:', e);
        }
    }, [editTab, params.partition, tabData]);

    const handleNavigation = React.useCallback((webview: Electron.WebviewTag) => {
        if (!isReady.current || !params.partition || !tabData) return;
        try {
            const url = webview.getURL();
            const title = webview.getTitle();
            if (tabData.url !== url || tabData.name !== title) {
                editTab(params.partition, {
                    ...tabData,
                    id: tabData.id,  // Ensure id is included
                    url,
                    name: title || tabData.name
                });
            }
        } catch (e) {
            console.debug('Error updating tab data:', e);
        }
    }, [editTab, params.partition, tabData]);

    useEffect(() => {
        const webview = localWebviewRef.current;
        if (!webview) return;

        let intervalId: NodeJS.Timeout | null = null;
        let isMounted = true;        const domReadyHandler = () => {
            handleDomReady();
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(() => {
                if (!isMounted) return;
                if (webview) checkAudioState(webview);
            }, 1000);
        };

        const navigationHandler = () => handleNavigation(webview);

        try {
            webview.addEventListener('dom-ready', domReadyHandler);
            webview.addEventListener('did-navigate', navigationHandler);
            webview.addEventListener('page-title-updated', navigationHandler);
            
            return () => {
                isMounted = false;
                if (intervalId) clearInterval(intervalId);
                webview.removeEventListener('dom-ready', domReadyHandler);
                webview.removeEventListener('did-navigate', navigationHandler);
                webview.removeEventListener('page-title-updated', navigationHandler);
            };
        } catch (e) {
            console.debug('Error setting up webview listeners:', e);
            return () => {
                isMounted = false;
                if (intervalId) clearInterval(intervalId);
            };
        }
    }, [handleDomReady, checkAudioState, handleNavigation]);

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