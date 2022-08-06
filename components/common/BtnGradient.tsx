import React from "react";

interface Props {
  title?: string;
  children?: React.ReactNode;
}

const BtnGradient: React.FC<Props> = ({ title, children }) => {
  return (
    <button
      type="button"
      className="rounded-full text-white text-base bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 focus:ring-4 focus:ring-purple-200 font-medium px-5 py-2.5 text-center"
    >
      {title ?? children}
    </button>
  );
};

export default BtnGradient;
