import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useMoralis } from "react-moralis";
import DashboardNav from "../../components/dashboard/DashboardNav";
import RegisterUser from "../../components/dashboard/RegisterUser";
import DashboardNavbar from "../../components/DashboardNavbar";
import ChatSection from "../../components/discussions/chat";

const Chat = () => {
  const { isAuthenticated, user, isInitializing, isInitialized } = useMoralis();
  const router = useRouter();

  // useEffect(() => {
  //   if (isInitialized && (!isAuthenticated || !user)) {
  //     router.replace("/");
  //   }
  // }, [isAuthenticated]);
  if (isInitializing) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <Head>
        <title>LearnDAO - Dashboard</title>
      </Head>
      <DashboardNavbar />
      {isAuthenticated && user?.getEmail() === undefined ? (
        <RegisterUser />
      ) : (
        <div className="mx-auto py-10 max-w-6xl flex flex-row items-start justify-center">
          <DashboardNav />
          <div className="w-3/4 flex flex-col space-y-5 items-start">
            <span className="text-white font-extrabold text-3xl text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-500">
                Discussions
              </span>
            </span>
            {isAuthenticated ? (
              <ChatSection roomId="group" />
            ) : (
              <div className="w-full flex justify-center">
                <span className="text-center text-3xl text-white font-bold mt-20">
                  Please Connect to start the discussion
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
