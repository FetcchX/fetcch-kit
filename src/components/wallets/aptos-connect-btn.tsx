import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { truncatePublicKey } from "./solana-connect-btn";

import type { Wallet, WalletName } from "@aptos-labs/wallet-adapter-react";
import {
  isRedirectable,
  useWallet,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-react";
import { useConnectedWallet } from "../../providers/fetcch-provider";

const AptosConnectButton = () => {
  const { wallets, connected: isConnected, account, disconnect } = useWallet();
  const [isAptosModalOpen, setIsAptosModalOpen] = useState(false);
  const { setConnectedWallet } = useConnectedWallet();

  return (
    <Dialog.Root open={isAptosModalOpen} onOpenChange={setIsAptosModalOpen}>
      <Dialog.Trigger asChild>
        <button
          className="w-full p-3 hover:bg-input flex items-center text-center text-lg font-semibold"
          type="button"
          onClick={(e) => {
            if (isConnected) {
              e.preventDefault();
              disconnect();
              setConnectedWallet(null);
            }
          }}>
          <span>
            {isConnected
              ? truncatePublicKey(account?.address as string)
              : "Aptos"}
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
            {wallets.map((wallet: Wallet) => {
              return (
                <WalletView wallet={wallet} setIsOpen={setIsAptosModalOpen} />
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AptosConnectButton;

const WalletView = ({
  wallet,
  setIsOpen,
}: {
  wallet: Wallet;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const { connectedWallet, setConnectedWallet } = useConnectedWallet();
  const { connect } = useWallet();
  const isWalletReady =
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable;
  const mobileSupport = wallet.deeplinkProvider;

  const { setWalletsModal, setConnectedWallet } = useConnectedWallet();

  const onWalletConnectRequest = async (walletName: WalletName) => {
    try {
      connect(walletName);
    } catch (error: any) {
      console.error(error);
    }
  };

  if (!isWalletReady && isRedirectable()) {
    // wallet has mobile app
    if (mobileSupport) {
      return (
        <button
          className="w-full p-3 hover:bg-input"
          disabled={false}
          key={wallet.name}>
          <>{wallet.name}</>
        </button>
      );
    }
    // wallet does not have mobile app
    return (
      <button disabled={true} key={wallet.name}>
        <>{wallet.name}</>
      </button>
    );
  } else {
    // we are on desktop view
    return (
      <button
        className="w-full p-3 hover:bg-input flex items-center"
        disabled={!isWalletReady}
        key={wallet.name}
        onClick={async () =>
          await onWalletConnectRequest(wallet.name)
            .then(() => setConnectedWallet("aptos"))
            .then(() => setIsOpen(false))
            .then(() => setWalletsModal(false))
        }>
        <>
          <img
            src={wallet.icon}
            alt="wallet_image"
            className="mr-3 h-8 w-8 rounded-full"
          />
          <span className="text-xl font-semibold">{wallet.name}</span>
        </>
      </button>
    );
  }
};
