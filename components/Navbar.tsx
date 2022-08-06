import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import BtnGradientBorder from "./common/BtnGradientBorder";
import ConnectModal from "./common/ConnectModal";
import LearnDAOLogo from "./common/LearnDAOLogo";

const Navbar = () => {
  const { isAuthenticated, user, isWeb3Enabled, web3, logout } = useMoralis();
  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      setConnectModalOpen(false);
    }
  }, [isAuthenticated]);

  return (
    <>
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />
      <header className="border-b border-gray-700">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <LearnDAOLogo />

          <nav className="flex items-center space-x-1 text-sm font-medium text-gray-800">
            <BtnGradientBorder
              title={isAuthenticated && user ? "Disconnect" : "Connect"}
              onClick={async () => {
                if (isAuthenticated) {
                  logout();
                } else {
                  setConnectModalOpen(true);
                }
              }}
            />
            {isAuthenticated && user && (
              <Link href="/dashboard">
                <a className="rounded-full text-white text-base bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 focus:ring-4 focus:ring-purple-200 font-medium px-5 py-2.5 text-center">
                  <div className="inline-flex items-center">
                    <span className="mr-2">Dashboard</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </a>
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
