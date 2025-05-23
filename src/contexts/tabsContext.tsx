import React from "react";

export type EditTabOption = {
    name?: string;
    url?: string;
    icon?: string;
    updatedAt?: number;
    lastActive?: number;
    isActive?: boolean;
    isPinned?: boolean;
    zoom?: number;
    audible?: boolean;
    muted?: boolean;
    webview?: React.RefObject<Electron.WebviewTag> | undefined;
}

export interface Tab extends EditTabOption {
    id: string;
    name: string;
    url: string;
    icon: string;
    createdAt: number;
    updatedAt: number;
    lastActive: number;
    isActive: boolean;
    isPinned: boolean;
    zoom: number;
    audible: boolean;
    muted: boolean;
    webview?: React.RefObject<Electron.WebviewTag> | undefined;
}

export interface TabsContextType {
    tabs: Tab[];
    addTab: (url: string) => void;
    removeTab: (id: string) => void;
    setActiveTab: (id: string) => void;
    getTab: (id: string) => Tab | undefined;
    getActiveTab: () => Tab | undefined;
    editTab: (id: string, data: EditTabOption) => void;
    setTabZoom: (id: string, zoom: number) => void;
    setTabs: (tabs: Tab[]) => void;
    setTabWebview: (id: string, webview: React.RefObject<Electron.WebviewTag>) => void;
}

export const defaultTab: Tab = {
    id: Date.now().toString(),
    name: "Youtube",
    url: "https://www.youtube.com/",
    icon: "/favicon_32x32.png",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastActive: Date.now(),
    isActive: false,
    isPinned: false,
    zoom: 0,
    audible: false,
    muted: false,
    webview: undefined,
}

const TabsContext = React.createContext<TabsContextType>({
    tabs: [{ ...defaultTab, isActive: true }],
    addTab: () => { },
    removeTab: () => { },
    setActiveTab: () => { },
    getTab: () => undefined,
    getActiveTab: () => undefined,
    editTab: () => { },
    setTabZoom: () => { },
    setTabs: () => { },
    setTabWebview: () => { },
});

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tabs, setTabs] = React.useState<Tab[]>([{ ...defaultTab, isActive: true }]);
    React.useEffect(() => {
        if (tabs.length === 0) window.ipcRenderer.send('close');
    }, [tabs]);
    const addTab = (url: string) => {
        const newTab: Tab = {
            id: Date.now().toString(),
            name: url,
            url: url,
            icon: "/favicon_32x32.png",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastActive: Date.now(),
            isActive: false,
            isPinned: false,
            zoom: 0,
            audible: false,
            muted: false,
            webview: undefined,
        };
        setTabs((prevTabs) => [...prevTabs, newTab]);
    }
    const removeTab = (id: string) => {
        const tabToRemove = tabs.find((tab) => tab.id === id);
        if (tabToRemove?.isActive) {
            const newTabs = tabs.filter((tab) => tab.id !== id);
            if (newTabs.length > 0) {
                newTabs[0].isActive = true;
            }
            setTabs(newTabs);
        }
        setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
    }
    const setActiveTab = (id: string) => {
        setTabs((prevTabs) => {
            return prevTabs.map((tab) => {
                if (tab.id === id) {
                    tab.isActive = true;
                } else {
                    tab.isActive = false;
                }
                return tab;
            });
        });
    }
    const getTab = (id: string) => {
        return tabs.find((tab) => tab.id === id);
    }
    const getActiveTab = () => {
        return tabs.find((tab) => tab.isActive);
    }
    const editTab = (id: string, data: EditTabOption) => {
        setTabs((prevTabs) => {
            return prevTabs.map((tab) => {
                if (tab.id === id) {
                    return {
                        ...tab,
                        ...data,
                        updatedAt: Date.now(),
                        // Preserve webview reference if not provided in data
                        webview: data.webview || tab.webview
                    };
                }
                return tab;
            });
        });
    }
    const setTabZoom = (id: string, zoom: number) => {
        setTabs((prevTabs) => {
            return prevTabs.map((tab) => {
                if (tab.id === id) {
                    tab.zoom = zoom;
                }
                return tab;
            });
        });
    }
    const setTabWebview = (id: string, webview: React.RefObject<Electron.WebviewTag>) => {
        setTabs((prevTabs) => {
            return prevTabs.map((tab) => {
                if (tab.id === id) {
                    tab.webview = webview;
                }
                return tab;
            });
        });
    }
    const value = { tabs, addTab, removeTab, setActiveTab, getTab, getActiveTab, editTab, setTabZoom, setTabs, setTabWebview };
    return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};

export const useTabs = () => React.useContext(TabsContext);