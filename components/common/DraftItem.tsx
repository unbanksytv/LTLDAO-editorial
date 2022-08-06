import Link from "next/link";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";

interface Props {
  title: string;
  description: string;
  user: any;
  proposalId: string;
  id: string;
}

const DraftItem: React.FC<Props> = ({
  title,
  description,
  user,
  proposalId,
  id,
}) => {
  const { Moralis } = useMoralis();
  const [userId, setUserId] = React.useState("");
  const [deadline, setDeadline] = React.useState("");
  const [votingPeriod, setVotingPeriod] = React.useState("");
  const [mode, setMode] = React.useState("");

  useEffect(() => {
    fetchContractData();
  });

  const fetchContractData = async () => {
    try {
      const Content = Moralis.Object.extend("Content");
      const query = new Moralis.Query(Content);
      var res = await query.equalTo("proposalMoralisId", id.toString()).find();
      setMode(res[0].get("mode"));
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <>
      <Link
        href={
          mode === "SUBMITTED"
            ? `/dashboard/my-drafts/`
            : `/dashboard/my-drafts/${id}`
        }
      >
        <a className="w-full p-6 border-gray-400 rounded-xl flex flex-col cursor-pointer transition-all duration-150 border-2 hover:border-[#fff]">
          <div className="flex justify-between w-full">
            <span className="text-white text-sm font-display opacity-60">
              by {user}
            </span>
            <span className="bg-green-500 rounded-full px-4 py-1 text-sm text-white font-bold ">
              {mode === "SUBMITTED" ? "COMPLETED" : "WORK IN PROGRESS"}
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

export default DraftItem;
