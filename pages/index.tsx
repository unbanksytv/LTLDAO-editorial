import Head from "next/head";
import React from "react";
import Explore from "../components/index/Explore";
import Hero from "../components/index/Hero";
import Navbar from "../components/Navbar";

function Index() {
  return (
    <>
      <Head>
        <title>LTL DAO - editorial</title>
      </Head>
      <Navbar />
      <Hero />
      <Explore />
    </>
  );
}

export default Index;
