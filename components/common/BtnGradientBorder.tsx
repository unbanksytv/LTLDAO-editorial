import React from "react";

interface Props {
  title: string;
  onClick?: () => void;
}

const BtnGradientBorder: React.FC<Props> = ({ title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-full relative inline-flex items-center justify-center p-0.5 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
    >
      <span className="rounded-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 group-hover:bg-opacity-0">
        {title}
      </span>
    </button>
  );
};

export default BtnGradientBorder;
