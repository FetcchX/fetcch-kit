import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { truncatePublicKey } from "./solana-connect-btn";
import { useConnectedWallet } from "../../providers/fetcch-provider";

const EvmConnectButton = () => {
  const { connectors, connectAsync, isLoading, pendingConnector } =
    useConnect();
  const { isConnected, address } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const [isEvmModalOpen, setIsEvmModalOpen] = useState(false);
  const { setWalletsModal, setConnectedWallet } = useConnectedWallet();

  return (
    <Dialog.Root open={isEvmModalOpen} onOpenChange={setIsEvmModalOpen}>
      <Dialog.Trigger asChild>
        <button
          className="w-full p-3 hover:bg-input flex items-center text-center text-lg font-semibold"
          onClick={async (e) => {
            if (isConnected) {
              e.preventDefault();
              await disconnectAsync().then(() => setConnectedWallet(null));
            }
          }}>
          {isConnected ? (
            <span>{truncatePublicKey(address as string)}</span>
          ) : (
            <>Ethereum</>
          )}
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
            {connectors.map((connector) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                className="w-full p-3 hover:bg-input"
                onClick={async () =>
                  await connectAsync({ connector })
                    .then(() => setConnectedWallet("evm"))
                    .then(() => setIsEvmModalOpen(false))
                    .then(() => setWalletsModal(false))
                }>
                <span className="flex w-full items-center text-left text-lg font-semibold">
                  {connector.name}
                  {isLoading && pendingConnector?.id === connector.id && (
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
                  )}
                </span>
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EvmConnectButton;
