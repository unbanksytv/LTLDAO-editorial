import { BigNumber, ethers } from "ethers";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaTwitter } from "react-icons/fa";
import Markdown from "react-markdown";
import { useMoralis } from "react-moralis";
import RegisterUser from "../../../components/dashboard/RegisterUser";
import DashboardNavbar from "../../../components/DashboardNavbar";
import { useDapp } from "../../../contexts/DappContext";
import contractAbi from "../../../utils/ABIs/LearnDAOGovernor.json";
import ldaoTokenAbi from "../../../utils/ABIs/LearnToken.json";
import {
  abbreviateNumber,
  CONTRACT_ADDRESS,
  LDAO_ADRESS,
  months,
} from "../../../utils/constants";
import { getStatus } from "../../../utils/helper";

const ProposalPage = () => {
  const { user, Moralis, isInitializing, isInitialized, isAuthenticated } =
    useMoralis();
  const router = useRouter();
  const { id } = router.query;

  const [ldaoContract, setLdaoContract] = React.useState(null);
  const [proposal, setProposal] = React.useState(null);
  const [deadline, setDeadline] = React.useState(null);
  const [proposalId, setProposalId] = React.useState(null);
  const [currStatus, setCurrStatus] = React.useState("");
  const [snapshot, setSnapshot] = React.useState(null);
  const [content, setContent] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [ipfs, setIpfs] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [hasVoted, setHasVoted] = React.useState(false);
  const [userAddress, setUserAddress] = React.useState("");
  const [votes, setVotes] = React.useState({
    for: "0",
    against: "0",
    abstain: "0",
  });

  const [totalSupply, setTotalSupply] = React.useState("");

  useEffect(() => {
    if (isInitialized && id) {
      fetchContractData();
    }
  }, [isInitialized, id]);

  const fetchContractData = async () => {
    try {
      const Proposals = Moralis.Object.extend("Proposals");
      const query = new Moralis.Query(Proposals);
      var proposal = await query.get(id.toString());

      var user = proposal.get("user");
      const User = Moralis.Object.extend("User");
      const userQuery = new Moralis.Query(User);
      var userRes = await userQuery.equalTo("username", user).first();
      var address = userRes?.toJSON().accounts[0];
      setUserAddress(userRes?.toJSON().accounts[0]);
      setAuthor(user);

      var ipfsUrl = proposal.get("content");
      setIpfs(ipfsUrl);

      var createdAt = proposal.get("createdAt");
      setStartDate(
        months[createdAt.getMonth()] +
          " " +
          createdAt.getDate() +
          ", " +
          createdAt.getFullYear() +
          ", " +
          createdAt.getHours() +
          ":" +
          createdAt.getMinutes()
      );

      await fetch(proposal.get("content")).then(async (data) => {
        var rawData = await data.text();
        setContent(rawData);
      });
      setProposal(proposal);
      const signer = Moralis.web3.getSigner();

      var learnDaoContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      );

      var ldaoTokenContract = new ethers.Contract(
        LDAO_ADRESS,
        ldaoTokenAbi.abi,
        signer
      );

      setLdaoContract(learnDaoContract);

      var supply = await ldaoTokenContract.totalSupply();
      setTotalSupply(ethers.utils.formatUnits(supply, 18));

      var proposalId = proposal.get("proposalId");
      setProposalId(proposalId);
      var state = await learnDaoContract.state(proposalId);
      setCurrStatus(getStatus(state));

      var deadline = await learnDaoContract.proposalDeadline(proposalId);
      setDeadline(deadline.toNumber());

      var proposalSnapshot = await learnDaoContract.proposalSnapshot(
        proposalId
      );
      setSnapshot(proposalSnapshot.toString());

      var proposals = await learnDaoContract.proposalVotes(proposalId);

      setVotes({
        for:
          proposals[1] == BigNumber.from(0)
            ? "0"
            : ethers.utils.formatUnits(proposals[1], 18).toString(),
        against:
          proposals[0] == BigNumber.from(0)
            ? "0"
            : ethers.utils.formatUnits(proposals[0], 18).toString(),
        abstain:
          proposals[2] == BigNumber.from(0)
            ? "0"
            : ethers.utils.formatUnits(proposals[2], 18).toString(),
      });
      if (address) {
        var voted = await learnDaoContract.hasVoted(proposalId, address);
        setHasVoted(voted);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const updateCurrStatus = async () => {
    try {
      var state = await ldaoContract.state(proposalId);
      setCurrStatus(getStatus(state));
    } catch (e) {
      console.log("e :>> ", e);
    }
  };

  const fetchVotes = async () => {
    try {
      var proposals = await ldaoContract.proposalVotes(proposalId);
      setVotes({
        for:
          proposals[1] == BigNumber.from(0)
            ? "0"
            : ethers.utils.formatUnits(proposals[0], 18).toString(),
        against:
          proposals[0] == BigNumber.from(0)
            ? "0"
            : ethers.utils.formatUnits(proposals[1], 18).toString(),
        abstain:
          proposals[2] == BigNumber.from(0)
            ? "0"
            : ethers.utils.formatUnits(proposals[2], 18).toString(),
      });
      var voted = await ldaoContract.hasVoted(proposalId, userAddress);
      setHasVoted(voted);
    } catch (e) {
      console.log("e :>> ", e);
    }
  };

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
        <div className="mx-auto py-10 max-w-5xl flex flex-row items-start justify-center">
          <div className="w-2/3 flex flex-col items-start">
            <Link href="/dashboard">
              <a className="text-white mb-3 opacity-60 hover:opacity-75 font-display inline-flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                back
              </a>
            </Link>
            <span className="text-white font-extrabold text-3xl text-center">
              {proposal?.get("title")}
            </span>
            <div className="flex flex-row items-center justify-between mt-5 w-full space-y-5">
              <span className="bg-green-500 rounded-full px-4 py-1 text-sm text-white font-bold ">
                {currStatus}
              </span>
              <div className="flex flex-row space-x-5">
                <FaTwitter
                  color="rgb(59 130 246)"
                  className="h-6 w-6 cursor-pointer"
                />
                <div className="flex flex-row space-3 opacity-60 cursor-pointer">
                  <span className="text-white font-bold">Copy</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <article className="reactMarkDown mt-5">
              <Markdown>{content}</Markdown>
            </article>
          </div>
          <div className="w-1/3 flex flex-col rounded-3xl py-8 ml-5 space-y-5">
            {/* Profile Section */}
            <div className="border rounded-2xl border-gray-500 flex flex-col">
              <div className="px-6 py-4 text-white font-bold border-b border-gray-500 border-">
                Information
              </div>
              <div className="px-6 py-5 text-white flex flex-col text-sm space-y-2">
                <div className="flex flex-row justify-between">
                  <span className="opacity-60">Author</span>
                  <span>{author}</span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="opacity-60">IPFS</span>
                  <a
                    href={ipfs}
                    target="_blank"
                    className="flex flex-row space-x-1 items-center"
                  >
                    <span className="hover:underline">
                      {ipfs.substring(
                        ipfs.indexOf("files/") + 6,
                        ipfs.indexOf("files/") + 18
                      )}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </a>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="opacity-60">Voting System</span>
                  <span>Single choice voting</span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="opacity-60">Start Date</span>
                  <span>{startDate}</span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="opacity-60">End Block</span>
                  <span>{deadline}</span>
                </div>
                <div className="flex flex-row justify-between">
                  <span className="opacity-60">Snapshot</span>
                  <a
                    href={`https://mumbai.polygonscan.com/block/${snapshot}`}
                    className="flex flex-row justify-between space-x-2 items-center"
                  >
                    <span>{snapshot}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="border rounded-2xl border-gray-500 flex flex-col">
              <div className="px-6 py-4 text-white font-bold border-b border-gray-500 border-">
                Results
              </div>
              <div className="px-6 py-5 text-white flex flex-col text-sm space-y-5">
                <div className="flex flex-col justify-between">
                  <span className="opacity-60">
                    For Votes - {abbreviateNumber(parseFloat(votes.for))}
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (parseFloat(votes.for) / parseFloat(totalSupply)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <span className="opacity-60">
                    Against Votes -{" "}
                    {abbreviateNumber(parseFloat(votes.against))}
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (parseFloat(votes.against) /
                            parseFloat(totalSupply)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <span className="opacity-60">
                    Abstain Votes -{" "}
                    {abbreviateNumber(parseFloat(votes.abstain))}
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (parseFloat(votes.abstain) /
                            parseFloat(totalSupply)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {isAuthenticated && currStatus !== "Pending" && (
              <MyVote
                proposalId={proposalId}
                userAddress={userAddress}
                hasVoted={hasVoted}
                fetchVotes={fetchVotes}
                status={currStatus}
              />
            )}

            {isAuthenticated && currStatus === "Succeeded" && (
              <ExecuteVote
                proposalId={proposalId}
                userAddress={userAddress}
                hasVoted={hasVoted}
                fetchVotes={fetchVotes}
                status={currStatus}
                id={proposal?.id ?? ""}
                value={content}
                updateCurrStatus={updateCurrStatus}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProposalPage;

const MyVote = ({ proposalId, userAddress, hasVoted, fetchVotes, status }) => {
  const { Moralis, isInitialized } = useMoralis();
  const { isWeb3Enabled } = useDapp();
  const [votingPower, setVotingPower] = useState("");

  useEffect(() => {
    if (isInitialized && isWeb3Enabled && userAddress) {
      getVotePower();
    }
  }, [isInitialized, isWeb3Enabled, userAddress]);

  const getVotePower = async () => {
    const signer = Moralis.web3.getSigner();
    var ldaoTokenContract = new ethers.Contract(
      LDAO_ADRESS,
      ldaoTokenAbi.abi,
      signer
    );
    var votePower = await ldaoTokenContract.balanceOf(userAddress);

    setVotingPower(ethers.utils.formatUnits(votePower, 18));
  };

  const vote = async (voteId: number) => {
    const signer = Moralis.web3.getSigner();

    var learnDaoContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractAbi.abi,
      signer
    );
    var txn = await learnDaoContract.castVote(proposalId, voteId);
    txn.wait();
    fetchVotes();
  };

  return (
    <div className="border rounded-2xl border-gray-500 flex flex-col">
      <div className="px-6 py-4 text-white font-bold border-b border-gray-500 border-">
        My Voting Power - {abbreviateNumber(parseInt(votingPower))}
      </div>
      <div className="px-6 py-5 text-white flex flex-col text-sm space-y-5">
        {hasVoted || (status != "Active" && status != "Pending") ? (
          <div className="flex flex-row items-center justify-start">
            <span className="text-lg font-bold">
              {status == "Active" ? "Already Voted" : "Voting Over"}
            </span>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 justify-between">
            <button
              onClick={() => {
                vote(1);
              }}
              className="rounded-full relative inline-flex items-center justify-center p-0.5 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <span className="w-full rounded-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 group-hover:bg-opacity-0">
                Vote For
              </span>
            </button>
            <button
              onClick={() => {
                vote(0);
              }}
              className="rounded-full relative inline-flex items-center justify-center p-0.5 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <span className="w-full rounded-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 group-hover:bg-opacity-0">
                Vote Against
              </span>
            </button>
            <button
              onClick={() => {
                vote(2);
              }}
              className="rounded-full relative inline-flex items-center justify-center p-0.5 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <span className="w-full rounded-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 group-hover:bg-opacity-0">
                Abstain
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ExecuteVote = ({
  proposalId,
  userAddress,
  hasVoted,
  fetchVotes,
  status,
  id,
  value,
  updateCurrStatus,
}) => {
  const { Moralis, isInitialized } = useMoralis();
  const { isWeb3Enabled } = useDapp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isInitialized && isWeb3Enabled && userAddress) {
    }
  }, [isInitialized, isWeb3Enabled, userAddress]);

  const execute = async () => {
    setLoading(true);
    const signer = Moralis.web3.getSigner();

    var learnDaoContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractAbi.abi,
      signer
    );
    const transferCalldata = learnDaoContract.interface.encodeFunctionData(
      "setAcceptedProposal",
      [id, userAddress]
    );
    var res = await learnDaoContract.execute(
      [learnDaoContract.address],
      [0],
      [transferCalldata],
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(value))
    );
    await res.wait();
    await updateCurrStatus();
    setLoading(false);
  };

  return (
    <div className="border rounded-2xl border-gray-500 flex flex-col">
      <div className="px-6 py-4 text-white font-bold border-b border-gray-500 border-">
        Proposal is Succeeded
        <br /> You can execute the proposal
      </div>
      <div className="px-6 py-5 text-white flex flex-col text-sm space-y-5">
        <div className="flex flex-col space-y-3 justify-between">
          <button
            onClick={() => {
              execute();
            }}
            disabled={loading}
            className={`${
              loading && "opacity-30 cursor-not-allowed"
            } rounded-full relative inline-flex items-center justify-center p-0.5 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800`}
          >
            <span className="w-full rounded-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 group-hover:bg-opacity-0">
              {loading ? "Please Wait..." : "Execute"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
