import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import WalletsModal from "./wallets/wallets-modal";
import { useConnectedWallet } from "../providers/fetcch-provider";
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { truncatePublicKey } from "./wallets/solana-connect-btn";

const FetcchModal = () => {
  const { walletsModal, setWalletsModal, connectedWallet, setConnectedWallet } =
    useConnectedWallet();

  const [connectedWalletAddress, setConnectedWalletAddress] =
    useState<string>("");

  const { isConnected: isEVMConnected, address } = useAccount();
  const { connected: isSolanaConnected, publicKey } = useWallet();
  const { connected: isAptosConnected, account } = useAptosWallet();

  const isAnyWalletConncted =
    isEVMConnected || isSolanaConnected || isAptosConnected;

  useEffect(() => {
    if (isAnyWalletConncted) {
      if (isEVMConnected && connectedWallet != "evm") {
        setConnectedWallet("evm");
        setConnectedWalletAddress(address as string);
      }
      if (isSolanaConnected && connectedWallet != "solana") {
        setConnectedWallet("solana");
        setConnectedWalletAddress(publicKey?.toBase58() as string);
      }
      if (isAptosConnected && connectedWallet != "aptos") {
        setConnectedWallet("aptos");
        setConnectedWalletAddress(account?.address as string);
      }
    } else {
      setConnectedWallet(null);
    }
  }, [isAnyWalletConncted, connectedWalletAddress, connectedWallet]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 backdrop-blur-sm" />
      <Dialog.Content className="ring-primary fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border-2 border-[#B0C8FE] bg-white p-9 shadow-lg ring-[3px] ring-inset duration-200 sm:rounded-lg md:w-full sm:max-w-xl md:max-w-md">
        <>
          {/* header */}
          <div className="flex text-center sm:text-left w-full flex-row items-center justify-between">
            {walletsModal && (
              <button
                onClick={() => setWalletsModal(false)}
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none border border-primary bg-white h-10 w-10">
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
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="sr-only">back</span>
              </button>
            )}
            <Dialog.Title className="text-xl md:text-3xl font-bold leading-none tracking-tight">
              {walletsModal ? "Connect Wallet" : "Pay With Fetcch"}
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
          {walletsModal ? (
            <WalletsModal />
          ) : (
            <>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-full h-72 bg-zinc-600 rounded-md" />
                <div className="w-full h-72 bg-purple-300 rounded-md">
                  QR Code
                </div>
              </div>

              <div className="flex flex-col md:flex-row space-y-3 md:space-x-3 md:space-y-0">
                {isAnyWalletConncted ? (
                  // TODO: add wallet diconnect modal
                  <a
                    // add the link here
                    href="#"
                    target="_blank"
                    className="flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none text-white shadow-[inset_0px_6px_4px_0px_rgba(255,255,255,0.2)] px-7 py-4 bg-primary hover:bg-primary/90 w-full">
                    {truncatePublicKey(connectedWalletAddress)}
                    {isSolanaConnected && (
                      <span className="ml-2">&#40;SOL&#41;</span>
                    )}
                    {isEVMConnected && (
                      <span className="ml-2">&#40;ETH&#41;</span>
                    )}
                    {isAptosConnected && (
                      <span className="ml-2">&#40;APT&#41;</span>
                    )}
                  </a>
                ) : (
                  <button
                    className="flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none text-white shadow-[inset_0px_6px_4px_0px_rgba(255,255,255,0.2)] px-7 py-4 bg-primary hover:bg-primary/90 w-full"
                    onClick={() => setWalletsModal(true)}>
                    Connect Wallet
                  </button>
                )}
                <button className="flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none text-primary shadow-[inset_0px_6px_4px_0px_rgba(255,255,255,0.2)] px-7 py-4 border border-primary bg-white w-full">
                  Open Link
                </button>
              </div>
            </>
          )}
        </>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default FetcchModal;
