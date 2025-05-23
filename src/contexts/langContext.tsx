import React from "react";
import { getLanguageByKey, Language, languages } from "../utils/i18n";

export interface LanguageContextType {
  language: Language;
  setLanguage: (key: string) => void;
}

const LanguageContext = React.createContext<LanguageContextType>({
  language: languages[0],
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setAppLanguage] = React.useState<Language>(languages[0]);

  const setLanguage = (key: string) => {
    const language = getLanguageByKey(key);
    if ( language ) setAppLanguage(language);
  }

  React.useEffect(() => {
    window.ipcRenderer.invoke("app:lang").then(key => {
      setLanguage(key);
    })
  }, []);
  
  const value = { language, setLanguage };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => React.useContext(LanguageContext);