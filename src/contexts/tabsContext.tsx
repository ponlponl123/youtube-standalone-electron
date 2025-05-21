import React from "react";

export type Tab = {
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
}

export interface TabsContextType {
    tabs: Tab[];
    addTab: (url: string) => void;
    removeTab: (id: string) => void;
    setActiveTab: (id: string) => void;
    editTab: (id: string, data: Tab) => void;
    setTabZoom: (id: string, zoom: number) => void;
}

export const defaultTab: Tab = {
    id: "1",
    name: "Youtube",
    url: "https://www.youtube.com/",
    icon: "/favicon_32x32.png",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastActive: Date.now(),
    isActive: false,
    isPinned: false,
    zoom: 1,
}

const TabsContext = React.createContext<TabsContextType>({
    tabs: [{...defaultTab, isActive: true}],
    addTab: () => {},
    removeTab: () => {},
    setActiveTab: () => {},
    editTab: () => {},
    setTabZoom: () => {},
});

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = React.useState<Tab[]>([{...defaultTab, isActive: true}]);
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
        zoom: 1,
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
    const editTab = (id: string, data: Tab) => {
        setTabs((prevTabs) => {
            return prevTabs.map((tab) => {
                if (tab.id === id) {
                    tab.name = data.name;
                    tab.url = data.url;
                    tab.icon = data.icon;
                    tab.updatedAt = Date.now();
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
    const value = { tabs, addTab, removeTab, setActiveTab, editTab, setTabZoom };
    return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};

export const useTabs = () => React.useContext(TabsContext);