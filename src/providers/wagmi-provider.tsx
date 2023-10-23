import React from "react";
import { createPublicClient, http } from "viem";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  const { chains, publicClient } = configureChains(
    [mainnet],
    [alchemyProvider({ apiKey: "" })]
  );

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [new MetaMaskConnector()],
    publicClient: createPublicClient({
      chain: mainnet,
      transport: http(),
    }),
  });

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};

export default WagmiProvider;
