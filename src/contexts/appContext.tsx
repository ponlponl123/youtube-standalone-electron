import React from "react";

export interface AppContextType {
  version: string;
  os_platform: string;
  os_release: string;
  isSettingShowed: string;
  showSetting: (value: string) => void;
}

const AppContext = React.createContext<AppContextType>({
  version: "",
  os_platform: "",
  os_release: "",
  isSettingShowed: "",
  showSetting: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [version, setVersion] = React.useState<string>("");
  const [os_platform, setOsPlatform] = React.useState<string>("");
  const [os_release, setOsRelease] = React.useState<string>("");
  const [isSettingShowed, setIsSettingShowed] = React.useState<string>("");

  React.useEffect(() => {
    window.ipcRenderer.invoke("app:version").then(version => {
        setVersion(version);
    })
    window.ipcRenderer.invoke("system:platform").then(platform => {
        setOsPlatform(platform);
    })
    window.ipcRenderer.invoke("system:release").then(version => {
        setOsRelease(version);
    })
  }, []);
  
  const value = { version, os_platform, os_release, isSettingShowed, showSetting: setIsSettingShowed };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => React.useContext(AppContext);