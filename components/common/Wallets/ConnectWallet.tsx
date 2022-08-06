import React from "react";
import Metamask from "./Metamask";
import WalletConnect from "./WalletConnect";

export const ConnectWallet = () => {
  return (
    <>
      <div className="max-w-md bg-[#1C1B26] rounded-lg shadow-md sm:p-6">
        <h3 className="mb-3 text-2xl font-semibold text-white font-display">
          Connect wallet
        </h3>
        <p className="text-base font-normal text-gray-300 font-display">
          Connect with one of our available wallet providers.
        </p>
        <ul className="my-4 space-y-3">
          <Metamask />
          <WalletConnect />
        </ul>
      </div>
    </>
  );
};
