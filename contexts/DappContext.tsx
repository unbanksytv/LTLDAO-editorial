declare let window: any;
import { createContext, useContext, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { DappContextProps } from "../utils/contracts";

const DappContext = createContext<DappContextProps>({
  isLoading: false,
  isWeb3Enabled: false,
  currentAccount: null,
});

export const DappProvider: React.FC = ({ children }) => {
  const data = useProviderData();

  return <DappContext.Provider value={data}>{children}</DappContext.Provider>;
};

export const useDapp = () => useContext<DappContextProps>(DappContext);

export const useProviderData = () => {
  const { isInitialized, Moralis, logout } = useMoralis();
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<String | null>(null);
  const [isWeb3Enabled, setIsWeb3Enabled] = useState(false);

  useEffect(() => {
    const unsubscribe = Moralis.onChainChanged((chain) => {
      logout();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isInitialized) {
      Moralis.enableWeb3().then(() => {
        setIsWeb3Enabled(true);
      });
    }
  }, [isInitialized]);

  return {
    isLoading,
    isWeb3Enabled,
    currentAccount,
  };
};
