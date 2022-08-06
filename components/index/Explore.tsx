import Link from "next/link";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import BtnGradientBorder from "../common/BtnGradientBorder";

const Explore = ({ showButton = true }) => {
  const { Moralis, isInitialized } = useMoralis();
  const [list, setList] = React.useState([]);

  useEffect(() => {
    if (isInitialized) {
      fetchData();
    }
  }, [isInitialized]);

  const fetchData = async () => {
    var Content = Moralis.Object.extend("Content");
    var query = new Moralis.Query(Content);
    query.equalTo("mode", "SUBMITTED");
    var res = await query.find();
    setList(res);
  };

  return (
    <div className="mx-auto max-w-6xl flex flex-col items-center justify-center relative mb-10">
      <span className="font-display font-bold text-white text-5xl">
        Explore Our Articles
      </span>
      <div className="absolute top-56 left-0 w-64 h-96 bg-yellow-500 rounded-full mix-blend-normal filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-56 left-28 w-80 h-96 bg-pink-500 rounded-full mix-blend-normal filter blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
      <div className="w-full flex flex-col relative my-12">
        <div className="grid grid-cols-3 gap-4">
          {list.map((item, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-start justify-center"
              >
                <img
                  src={item.get("bannerImage")}
                  className="rounded-t-3xl w-full"
                />
                <div className="flex flex-col bg-[#1C1B26] w-full p-5 rounded-b-3xl pb-10">
                  <span className="font-display text-xl font-bold text-white">
                    {item.get("title")}
                  </span>
                  <span className="font-display text-lg font-semibold text-white opacity-50 py-4">
                    {item.get("content").substring(0, 100)}
                  </span>
                  <div>
                    <Link href={`/${item.id}`}>
                      <a className="inline-flex items-center flex-row space-x-2 cursor-pointer hover-underline-animation text-white hover:text-pink-500 transition-all delay-100 font-bold text-xl">
                        <span>Start Reading</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
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
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showButton && (
        <Link href="/articles">
          <a className="w-full flex justify-center">
            <BtnGradientBorder title="All Articles" />
          </a>
        </Link>
      )}
    </div>
  );
};

export default Explore;
