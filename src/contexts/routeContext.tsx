import React from "react";

export interface RouteContextType {
  route: string;
  previousRoute: string;
  setRoute: (route: string) => void;
}

const RouteContext = React.createContext<RouteContextType>({
  route: "/",
  previousRoute: "/",
  setRoute: () => {},
});
RouteContext.displayName = "RouteContext";
export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = React.useState<string>("/");
  const [previousRoute, setPreviousRoute] = React.useState<string>("/");

  const setRouteHandler = (value: string) => {
    setPreviousRoute(route);
    setRoute(value);
  }

  const value = { route, previousRoute, setRoute: setRouteHandler };
  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
};

export const useRoute = () => React.useContext(RouteContext);