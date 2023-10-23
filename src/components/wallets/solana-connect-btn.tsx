import type { WalletName } from "@solana/wallet-adapter-base";
import React, { useCallback, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { Wallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import * as Dialog from "@radix-ui/react-dialog";
import { useConnectedWallet } from "../../providers/fetcch-provider";

const SolanaConnectBtutton = () => {
  const {
    publicKey,
    connected,
    disconnect,
    wallet,
    wallets,
    select,
    connecting,
  } = useWallet();

  const { setWalletsModal, setConnectedWallet } = useConnectedWallet();

  const isConnected = connected && publicKey && wallet;

  const [listedWallets, collapsedWallets] = useMemo(() => {
    const installed: Wallet[] = [];
    const loadable: Wallet[] = [];
    const notDetected: Wallet[] = [];

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.NotDetected) {
        notDetected.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Loadable) {
        loadable.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      }
    }

    let listed: Wallet[] = [];
    let collapsed: Wallet[] = [];

    if (installed.length) {
      listed = installed;
      collapsed = [...loadable, ...notDetected];
    } else if (loadable.length) {
      listed = loadable;
      collapsed = notDetected;
    } else {
      collapsed = notDetected;
    }

    return [listed, collapsed];
  }, [wallets]);

  const handleWalletClick = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
      walletName: WalletName
    ) => {
      select(walletName);
    },
    [select]
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="w-full p-3 hover:bg-input flex items-center text-center text-lg font-semibold"
          type="button"
          onClick={async (e) => {
            if (isConnected) {
              e.preventDefault();
              await disconnect().then(() => setConnectedWallet(null));
            }
          }}>
          <span>
            {isConnected
              ? truncatePublicKey(publicKey?.toBase58() as string)
              : "Solana"}
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content className="ring-primary fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border-2 border-[#B0C8FE] bg-white p-9 shadow-lg ring-[3px] ring-inset duration-200 sm:rounded-lg md:w-full sm:max-w-xl md:max-w-md">
          <div className="w-full flex items-center justify-between">
            <Dialog.Title className="font-manrope text-3xl font-bold">
              Select Wallet
            </Dialog.Title>
            <Dialog.Close className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none border border-primary bg-white h-10 w-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4 font-bold text-primary"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          <div className="mt-6 flex w-full flex-col space-y-3">
            {listedWallets.map((wallet) => (
              <button
                disabled={!wallet.readyState}
                key={wallet.adapter.name}
                className="w-full p-3 hover:bg-input"
                onClick={(event) => {
                  handleWalletClick(event, wallet.adapter.name);
                  setConnectedWallet("solana");
                  setWalletsModal(false);
                }}>
                <span className="flex w-full items-center text-left text-lg font-semibold">
                  {connecting ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-3 animate-spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : (
                    <img
                      src={wallet.adapter.icon}
                      alt="wallet_icon"
                      className="w-8 h-8 mr-3"
                    />
                  )}
                  {wallet.adapter.name}
                </span>
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SolanaConnectBtutton;

export const truncatePublicKey = (address: string, chars = 4): string => {
  const start = address.slice(0, chars);
  const end = address.slice(-chars);
  return `${start}...${end}`;
};
