import React from "react";

export interface AppContextType {
  version: string;
  os_platform: string;
  os_release: string;
  isSettingShowed: string;
  showSetting: (value: string) => void;
  isPIN: boolean;
  isLocked: boolean;
  setIsLocked: (value: boolean, pin?: number) => void;
}

const AppContext = React.createContext<AppContextType>({
  version: "",
  os_platform: "",
  os_release: "",
  isSettingShowed: "",
  showSetting: () => {},
  isPIN: false,
  isLocked: false,
  setIsLocked: () => {}
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [version, setVersion] = React.useState<string>("");
  const [os_platform, setOsPlatform] = React.useState<string>("");
  const [os_release, setOsRelease] = React.useState<string>("");
  const [isSettingShowed, setIsSettingShowed] = React.useState<string>("");
  const [isPIN, setIsPIN] = React.useState<boolean>(false);
  const [isLocked, setIsLocked] = React.useState<boolean>(false);

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
    const PINManager = (_event: Electron.IpcRendererEvent, isActive: boolean) => {
      setIsPIN(isActive);
    }

    window.ipcRenderer.on("app:pin", PINManager);
    return () => {
      window.ipcRenderer.off("app:pin", PINManager);
    }
  }, []);

  const userSetIsLocked = (value: boolean, pin?: number) => {
    if ( isPIN && !value )
    {
      const isPINValid = window.ipcRenderer.invoke("app:pin:validate", pin);
      if ( !pin || !isPINValid ) return;
    }
    setIsLocked(value);
  }
  
  const value = { version, os_platform, os_release, isSettingShowed, showSetting: setIsSettingShowed,
    isPIN, isLocked, setIsLocked: userSetIsLocked
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => React.useContext(AppContext);