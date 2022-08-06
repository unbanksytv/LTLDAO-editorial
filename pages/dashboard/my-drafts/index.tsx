import { ethers } from "moralis/node_modules/ethers";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import DraftItem from "../../../components/common/DraftItem";
import DashboardNav from "../../../components/dashboard/DashboardNav";
import RegisterUser from "../../../components/dashboard/RegisterUser";
import DashboardNavbar from "../../../components/DashboardNavbar";
import { useDapp } from "../../../contexts/DappContext";
import contractAbi from "../../../utils/ABIs/LearnDAOGovernor.json";
import { CONTRACT_ADDRESS } from "../../../utils/constants";

const DashboardIndex = () => {
  const { isAuthenticated, user, isInitializing, isInitialized, Moralis } =
    useMoralis();
  const router = useRouter();
  const { isWeb3Enabled } = useDapp();
  const { data, error, isLoading, fetch } = useMoralisQuery("Proposals");
  const [allDrafts, setAllDrafts] = React.useState([]);

  // useEffect(() => {
  //   if (isInitialized && (!isAuthenticated || !user)) {
  //     router.replace("/");
  //   }
  // }, [isAuthenticated]);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (data && isWeb3Enabled && isAuthenticated) getAllDrafts();
  }, [data, isWeb3Enabled]);

  const getAllDrafts = async () => {
    const signer = Moralis.web3.getSigner();

    var learnDaoContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractAbi.abi,
      signer
    );
    var list = [];
    for (let i = 0; i < data.length; i++) {
      var userAdd = await learnDaoContract.acceptedProposal(data[i].id);
      if (userAdd.toLowerCase() === user.toJSON().accounts[0].toLowerCase()) {
        list.push(data[i]);
      }
    }
    setAllDrafts(list);
  };

  if (isInitializing && !isLoading) {
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
          {isAuthenticated ? (
            <div className="w-3/4 flex flex-col items-start">
              <span className="text-white font-extrabold text-3xl text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-500">
                  All Drafts
                </span>
              </span>
              <div className="flex flex-col mt-5 w-full space-y-5">
                {[]
                  .concat(allDrafts)
                  .reverse()
                  .map((item, index) => {
                    return (
                      <DraftItem
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
          ) : (
            <div className="w-full flex justify-center">
              <span className="text-center text-3xl text-white font-bold mt-20">
                Please Connect to start the discussion
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DashboardIndex;
