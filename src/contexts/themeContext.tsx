import React from "react";

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState<string>("dark");
  React.useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      window.document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
      window.ipcRenderer.invoke("system:theme").then((res: string) => {
        const parsedTheme = res ? "dark" : "light";
        setTheme(parsedTheme);
        window.document.documentElement.setAttribute("data-theme", parsedTheme);
      })
    }
  }, []);
  window.ipcRenderer.on("theme", (_event, theme: string) => {
    const parsedTheme = theme ? "dark" : "light";
    setTheme(parsedTheme);
    window.document.documentElement.setAttribute("data-theme", parsedTheme);
  });
  React.useEffect(() => {
    localStorage.setItem("theme", theme);
  },[theme])
  const setThemeValue = (newTheme: string) => {
    setTheme(newTheme);
    window.document.documentElement.classList.value = window.document.documentElement.classList.value.replace(theme, newTheme);
    window.document.documentElement.setAttribute("data-theme", newTheme);
  };
  const value = { theme, setTheme: setThemeValue };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => React.useContext(ThemeContext);