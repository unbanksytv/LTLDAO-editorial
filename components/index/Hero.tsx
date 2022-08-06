import React from "react";

const Hero = () => {
  return (
    <>
      <div className="mx-auto py-32 max-w-6xl flex flex-row items-center justify-center relative">
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-normal filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-normal filter blur-3xl opacity-40 animate-blob animation-delay-3000"></div>
        <div className="w-3/5 flex flex-col relative opacity-100 ">
          <span className="text-white font-extrabold text-7xl">
            Join Live The Life to onboard{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-500">
              Developers
            </span>{" "}
            to Web3
          </span>
          <span className="text-white opacity-60 font-bold text-2xl mt-4">
            We're a learning DAO creating quality web3 education.
          </span>
          <div className="py-5 inline-block">
            <a className="inline-flex items-center flex-row space-x-2 cursor-pointer hover-underline-animation text-white hover:text-pink-500 transition-all delay-100 font-bold text-3xl">
              <span>Start Living The Life</span>
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
          </div>
        </div>
        <div className="w-2/5 px-10">
          <img src="https://livethelife.tv/content/images/2022/05/LTL_V2-02.png" />
        </div>
      </div>
    </>
  );
};

export default Hero;
