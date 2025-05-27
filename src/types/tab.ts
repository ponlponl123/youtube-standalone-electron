export type EditTabOption = {
    name?: string;
    url?: string;
    icon?: string;
    updatedAt?: number;
    lastActive?: number;
    isPinned?: boolean;
    zoom?: number;
    audible?: boolean;
    muted?: boolean;
    ready?: boolean;
    loading?: boolean;
    canGoBack?: boolean;
    canGoForward?: boolean;
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
    ready: boolean;
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