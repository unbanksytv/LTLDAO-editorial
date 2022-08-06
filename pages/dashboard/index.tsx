import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import ProposalItem from "../../components/common/ProposalItem";
import DashboardNav from "../../components/dashboard/DashboardNav";
import RegisterUser from "../../components/dashboard/RegisterUser";
import DashboardNavbar from "../../components/DashboardNavbar";

const DashboardIndex = () => {
  const { isAuthenticated, user, isInitializing, isInitialized } = useMoralis();
  const router = useRouter();
  const { data, error, isLoading } = useMoralisQuery("Proposals");

  // useEffect(() => {
  //   if (isInitialized && (!isAuthenticated || !user)) {
  //     router.replace("/");
  //   }
  // }, [isAuthenticated]);

  useEffect(() => {
    console.log("data :>> ", data);
  }, [isLoading]);

  if (isInitializing && !isLoading && !user) {
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
          <div className="w-3/4 flex flex-col items-start">
            <span className="text-white font-extrabold text-3xl text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-500">
                Proposals
              </span>
            </span>
            <div className="flex flex-col mt-5 w-full space-y-5">
              {[]
                .concat(data)
                .reverse()
                .map((item, index) => {
                  return (
                    <ProposalItem
                      key={index}
                      title={item.get("title")}
                      proposalId={item.get("proposalId")}
                      description={`Title: ${item.get("description")}`}
                      user={item.get("user")}
                      id={item.id}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardIndex;
