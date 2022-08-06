import { Hashicon } from "@emeraldpay/hashicon-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMoralis } from "react-moralis";

const DashboardNav = () => {
  const { isAuthenticated } = useMoralis();
  const { user } = useMoralis();
  const router = useRouter();

  return (
    <>
      <div className="w-1/4 flex flex-col rounded-3xl py-8">
        {/* Profile Section */}
        {isAuthenticated && (
          <div className="flex flex-row items-center space-x-3 group p-2 rounded-lg cursor-pointer">
            <Hashicon value={"value"} size={50} />
            {/* <div className="w-12 h-12 rounded-full bg-red-500"></div> */}
            <div className="flex-1 flex flex-col">
              <span className="font-display font-bold text-lg text-white group-hover:text-transparent bg-clip-text bg-gradient-to-r group-hover:to-purple-600 group-hover:from-pink-500">
                {user.getUsername()}
              </span>
              <span className="text-white font-display font-semibold text-xs">
                {user.getEmail()}
              </span>
            </div>
          </div>
        )}

        {/* Items */}
        <Link href="/dashboard">
          <a className="mt-5 flex flex-row items-center space-x-3 group px-5 py-4 rounded-lg cursor-pointer">
            <div className="w-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <span
                className={`font-display font-bold text-lg text-white group-hover:text-transparent bg-clip-text bg-gradient-to-r group-hover:to-purple-600 group-hover:from-pink-500 ${
                  router.pathname === "/dashboard" &&
                  "to-purple-600 from-pink-500 text-transparent"
                } `}
              >
                Proposals
              </span>
            </div>
          </a>
        </Link>

        <Link href="/dashboard/discussions">
          <a className="mt-1 flex flex-row items-center space-x-3 group px-5 py-4 rounded-lg cursor-pointer">
            <div className="w-12">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <span
                className={`font-display font-bold text-lg text-white group-hover:text-transparent bg-clip-text bg-gradient-to-r group-hover:to-purple-600 group-hover:from-pink-500 ${
                  router.pathname === "/dashboard/discussions" &&
                  "to-purple-600 from-pink-500 text-transparent"
                } `}
              >
                Discussions
              </span>
            </div>
          </a>
        </Link>

        <Link href="/dashboard/new-proposal">
          <a className="mt-1 flex flex-row items-center space-x-3 group px-5 py-4 rounded-lg cursor-pointer">
            <div className="w-12">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="flex-1">
              <span
                className={`font-display font-bold text-lg text-white group-hover:text-transparent bg-clip-text bg-gradient-to-r group-hover:to-purple-600 group-hover:from-pink-500 ${
                  router.pathname === "/dashboard/new-proposal" &&
                  "to-purple-600 from-pink-500 text-transparent"
                } `}
              >
                New Proposal
              </span>
            </div>
          </a>
        </Link>

        <Link href="/dashboard/my-drafts">
          <a className="mt-1 flex flex-row items-center space-x-3 group px-5 py-4 rounded-lg cursor-pointer">
            <div className="w-12">
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <span
                className={`font-display font-bold text-lg text-white group-hover:text-transparent bg-clip-text bg-gradient-to-r group-hover:to-purple-600 group-hover:from-pink-500 ${
                  router.pathname === "/dashboard/my-drafts" &&
                  "to-purple-600 from-pink-500 text-transparent"
                } `}
              >
                All Drafts
              </span>
            </div>
          </a>
        </Link>
      </div>
    </>
  );
};

export default DashboardNav;
