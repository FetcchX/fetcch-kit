import React, { createContext, useContext, useState } from "react";
import WagmiProvider from "./wagmi-provider";
import SolanaProvider from "./solana-provider";
import AptosProvider from "./aptos-provider";

export type WALLET = "evm" | "solana" | "aptos" | null;

type WalletContextTypes = {
  connectedWallet: WALLET;
  setConnectedWallet: React.Dispatch<React.SetStateAction<WALLET>>;
  addressChain: WALLET;
  setAddressChain: React.Dispatch<React.SetStateAction<WALLET>>;
  walletsModal: boolean;
  setWalletsModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const WalletContext = createContext<WalletContextTypes | null>(null);

export const useConnectedWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error(
      "useConnectedWallet must be used within the wallet context"
    );
  }
  return context;
};

export default function FetcchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connectedWallet, setConnectedWallet] = useState<WALLET | null>(null);
  const [addressChain, setAddressChain] = useState<WALLET | null>(null);
  const [walletsModal, setWalletsModal] = useState(false);

  return (
    <WalletContext.Provider
      value={{
        connectedWallet,
        setConnectedWallet,
        addressChain,
        setAddressChain,
        walletsModal,
        setWalletsModal,
      }}>
      <WagmiProvider>
        <SolanaProvider>
          <AptosProvider>{children}</AptosProvider>
        </SolanaProvider>
      </WagmiProvider>
    </WalletContext.Provider>
  );
}
