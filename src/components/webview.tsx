import React, { useRef, useEffect, WebViewHTMLAttributes } from 'react'
import { useTabs } from '../contexts/tabsContext';

function WebView(params: WebViewHTMLAttributes<Electron.WebviewTag>) {
    const { setTabWebview, editTab, tabs } = useTabs();
    const tabData = React.useMemo(() => params.partition ? tabs.find(tab => tab.id === params.partition) : undefined, [tabs, params.partition]);
    const origin = useRef(tabData?.url);
    const isReady = useRef(false);
    const localWebviewRef = useRef<Electron.WebviewTag>(null);
    const setupComplete = useRef(false);
    const webviewId = params.partition as string;
    
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
    }, [params.partition, setTabWebview, tabData?.webview]);
    
    const handleDomReady = React.useCallback(() => {
        console.log("Webview is ready");
        isReady.current = true;
        if (params.partition) editTab(params.partition, {ready: true});
    }, [params.partition, editTab]);

    const checkAudioState = React.useCallback((webview: Electron.WebviewTag) => {
        if (!isReady.current || !params.partition || !tabData) return;
        try {
            const isAudible = webview.isCurrentlyAudible();
            const isMuted = webview.isAudioMuted();
            
            editTab(params.partition, {
                audible: isAudible,
                muted: isMuted
            });
        } catch (e) {
            console.debug('Ignoring webview state check error:', e);
        }
    }, [editTab, params.partition, tabData]);

    const handleNavigation = React.useCallback((webview: Electron.WebviewTag) => {
        if (!isReady.current || !params.partition || !tabData) return;
        try {
            const url = webview.getURL();
            const title = webview.getTitle();
            const canGoBack = webview.canGoBack();
            const canGoForward = webview.canGoForward();
            const zoom = webview.getZoomLevel();
            if (tabData.url !== url || tabData.name !== title) {
                editTab(params.partition, {
                    ...tabData,
                    url,
                    name: title || tabData.name,
                    canGoBack,
                    canGoForward,
                    zoom
                });
            }
        } catch (e) {
            console.debug('Error updating tab data:', e);
        }
    }, [editTab, params.partition, tabData]);
    
    useEffect(() => {
        editTab(webviewId, {ready: false});
        const webview = localWebviewRef.current;
        if (!webview) return;

        let intervalId: NodeJS.Timeout | null = null;
        let isMounted = true;

        // Setup audio state check interval
        const setupAudioStateCheck = () => {
            if (!isMounted) return;
            if (intervalId) {
                clearInterval(intervalId);
            }
            
            intervalId = setInterval(() => {
                if (!isMounted || !webview) {
                    if (intervalId) clearInterval(intervalId);
                    return;
                }
                checkAudioState(webview);
            }, 1000);
        };

        const domReadyHandler = () => {
            if (!isMounted) return;
            handleDomReady();
            setupAudioStateCheck();
        };

        const navigationHandler = () => handleNavigation(webview);
        const loadstartHandler = () => editTab(webviewId, {loading: true});
        const loadstopHandler = () => editTab(webviewId, {loading: false});

        try {
            webview.addEventListener('dom-ready', domReadyHandler);
            webview.addEventListener('did-navigate', navigationHandler);
            webview.addEventListener('page-title-updated', navigationHandler);
            webview.addEventListener('did-start-loading', loadstartHandler);
            webview.addEventListener('did-stop-loading', loadstopHandler);
        } catch (e) {
            console.debug('Error setting up webview listeners:', e);
        }
            
        // Single cleanup function that handles both success and error cases
        return () => {
            if (!webview) return; // Don't cleanup if webview is not available
            
            isMounted = false;
            if (intervalId) {
                console.log("Clearing audio state check interval...");
                clearInterval(intervalId);
            }
            try {
                webview.removeEventListener('dom-ready', domReadyHandler);
                webview.removeEventListener('did-navigate', navigationHandler);
                webview.removeEventListener('page-title-updated', navigationHandler);
                webview.removeEventListener('did-start-loading', loadstartHandler);
                webview.removeEventListener('did-stop-loading', loadstopHandler);
            } catch (e) {
                console.debug('Error cleaning up webview listeners:', e);
            }
        };
    }, [webviewId]); // Remove dependencies that can cause unnecessary re-renders

    useEffect(() => {
        try {
            const webview = localWebviewRef.current;
            if (!isReady.current || !params.partition || !tabData || !webview) return;
            webview.setAudioMuted(tabData.muted);
            webview.setZoomLevel(tabData.zoom);
        } catch {
            // Ignore errors
        }
    }, [params.partition, tabData, localWebviewRef])

    return (
        <webview
            ref={localWebviewRef}
            key={params.partition}
            partition={params.partition}
            style={{
                zoom: 0.6,
            }}
            src={origin.current}
            {...params}
            // webpreferences="allowRunningInsecureContent"
            // @ts-expect-error TypeScript doesn't recognize the webview tag
            nodeintegration="false"
        ></webview>
    );
}

export default WebView;