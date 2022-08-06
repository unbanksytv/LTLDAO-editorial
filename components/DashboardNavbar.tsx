import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import BtnGradientBorder from "./common/BtnGradientBorder";
import ConnectModal from "./common/ConnectModal";
import LearnDAOLogo from "./common/LearnDAOLogo";

const DashboardNavbar = () => {
  const { isAuthenticated, user, logout } = useMoralis();
  const [isConnectModalOpen, setConnectModalOpen] = useState<boolean>(false);

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
                if (isAuthenticated && user) {
                  logout();
                } else if (!isAuthenticated) {
                  setConnectModalOpen(true);
                }
              }}
            />
          </nav>
        </div>
      </header>
    </>
  );
};

export default DashboardNavbar;
