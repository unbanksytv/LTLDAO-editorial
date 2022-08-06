import Head from "next/head";
import React from "react";
import Explore from "../components/index/Explore";
import Navbar from "../components/Navbar";

function Index() {
  return (
    <>
      <Head>
        <title>LTL DAO - editorial</title>
      </Head>
      <Navbar />
      <div className="mt-10">
        <Explore showButton={false} />
      </div>
    </>
  );
}

export default Index;
