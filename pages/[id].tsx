import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Markdown from "react-markdown";
import { useMoralis } from "react-moralis";
import Navbar from "../components/Navbar";

const Content = () => {
  const { isAuthenticated, user, isInitializing, isInitialized, Moralis } =
    useMoralis();
  const [content, setContent] = React.useState(null);
  const router = useRouter();
  const { id } = router.query;
  // useEffect(() => {
  //   if (isInitialized && (!isAuthenticated || !user)) {
  //     router.replace("/");
  //   }
  // }, [isAuthenticated]);

  useEffect(() => {
    if (isInitialized) fetchData();
  }, [isInitialized]);

  const fetchData = async () => {
    var Content = Moralis.Object.extend("Content");
    var query = new Moralis.Query(Content);
    var res = await query.get(id.toString());
    setContent(res);
  };

  if (isInitializing) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <Head>
        <title>LearnDAO - Dashboard</title>
      </Head>
      <Navbar />
      <div className="mx-auto py-10 max-w-4xl">
        <div className="w-full flex flex-col space-y-5 items-start">
          <Link href="/">
            <a className="text-white mb-1 opacity-60 hover:opacity-75 font-display inline-flex">
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
          <span className="text-white font-extrabold text-3xl flex flex-col items-start">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-500">
              {content?.get("category")}
            </span>
            <span className="text-white font-bold text-4xl mt-3">
              {content?.get("title")}
            </span>
            <span className="text-white font-normal text-base mt-3 opacity-60">
              by - {"0xViral"}
            </span>
            <span className="text-white font-normal text-base mt-0 opacity-60">
              {"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}
            </span>
            <div className="reactMarkDown mt-5 max-w-4xl">
              <Markdown>{content?.get("content")}</Markdown>
            </div>
          </span>
        </div>
      </div>
    </>
  );
};

export default Content;
