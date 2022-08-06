import { ethers } from "ethers";
import Link from "next/link";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import contractAbi from "../../utils/ABIs/LearnDAOGovernor.json";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { getStatus } from "../../utils/helper";

interface Props {
  title: string;
  description: string;
  user: string;
  proposalId: string;
  id: string;
}

const ProposalItem: React.FC<Props> = ({
  title,
  description,
  user,
  proposalId,
  id,
}) => {
  const { Moralis } = useMoralis();
  const [userId, setUserId] = React.useState("");
  const [currStatus, setCurrStatus] = React.useState("");
  const [deadline, setDeadline] = React.useState("");
  const [votingPeriod, setVotingPeriod] = React.useState("");
  const [proposalDeadline, setProposalDeadline] = React.useState("");

  useEffect(() => {
    fetchContractData();
  });

  const fetchContractData = async () => {
    try {
      setUserId(user);
      const signer = Moralis.web3.getSigner();

      var learnDaoContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      );
      var state = await learnDaoContract.state(proposalId);
      var deadline = await learnDaoContract.proposalDeadline(proposalId);
      setDeadline(deadline.toNumber());
      var started = await learnDaoContract.votingPeriod();
      setVotingPeriod(started.toNumber());

      setCurrStatus(getStatus(state));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <>
      <Link href={`/dashboard/proposals/${id}`}>
        <a className="w-full p-6 border-gray-400 rounded-xl flex flex-col cursor-pointer transition-all duration-150 border-2 hover:border-[#fff]">
          <div className="flex justify-between w-full">
            <span className="text-white text-sm font-display opacity-60">
              by {userId}
            </span>
            <span className="bg-green-500 rounded-full px-4 py-1 text-sm text-white font-bold ">
              {currStatus}
            </span>
          </div>
          <span className="mt-3 text-white text-xl font-bold font-display opacity-90">
            {title}
          </span>
          <span className="mt-3 text-white text-base font-semibold font-display opacity-70">
            {description}
          </span>
          <div className="flex justify-between mt-3">
            <span className="text-white text-sm font-display font-semibold opacity-70 mt-3">
              Voting ends on - Block {deadline}
            </span>
          </div>
        </a>
      </Link>
    </>
  );
};

export default ProposalItem;
