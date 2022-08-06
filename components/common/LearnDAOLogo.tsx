import Link from "next/link";
import React from "react";

const LearnDAOLogo = () => {
  return (
    <>
      <nav className="hidden items-center space-x-1 text-sm font-medium text-gray-800 md:flex">
        <Link href="/">
          <a className="font-bold text-white text-3xl font-display">
            LTL
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-500">
              .
            </span>
          </a>
        </Link>
      </nav>
    </>
  );
};

export default LearnDAOLogo;
