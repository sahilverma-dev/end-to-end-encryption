import { ReactNode, createContext, useContext, useRef, Ref } from "react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { TopLoaderContextReturnType } from "../interfaces";

const TopLoaderContext = createContext<TopLoaderContextReturnType | null>(null);

interface TopLoaderProviderProps {
  children: ReactNode;
}

const TopLoaderProvider = ({ children }: TopLoaderProviderProps) => {
  const loaderRef = useRef<any>();
  const start = () => loaderRef.current.continuousStart();
  const stop = () => loaderRef.current.complete();

  return (
    <TopLoaderContext.Provider
      value={{
        start,
        stop,
      }}
    >
      <LoadingBar height={5} ref={loaderRef} color="#1d4ed8" className="z-50" />
      {children}
    </TopLoaderContext.Provider>
  );
};

const useTopLoader = () => {
  const authContext = useContext(TopLoaderContext);
  if (authContext) {
    return authContext;
  } else {
    throw new Error("Something is wrong with auth context");
  }
};

export { TopLoaderProvider, useTopLoader };
