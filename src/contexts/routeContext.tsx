import React from "react";

export interface RouteContextType {
  route: string;
  setRoute: (route: string) => void;
}

const RouteContext = React.createContext<RouteContextType>({
    route: "/",
    setRoute: () => {},
});
RouteContext.displayName = "RouteContext";
export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = React.useState<string>("/");
  const value = { route, setRoute };
  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
};

export const useRoute = () => React.useContext(RouteContext);