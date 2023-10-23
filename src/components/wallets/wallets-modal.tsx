import React from "react";
import EvmConnectButton from "./evm-connect-btn";
import SolanaConnectBtutton from "./solana-connect-btn";
import AptosConnectButton from "./aptos-connect-btn";

const WalletsModal = () => {
  return (
    <div className="flex items-center flex-col w-full space-y-3">
      <EvmConnectButton />
      <SolanaConnectBtutton />
      <AptosConnectButton />
    </div>
  );
};

export default WalletsModal;
