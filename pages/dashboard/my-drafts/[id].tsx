import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import mermaid from "mermaid";
import { ethers } from "moralis/node_modules/ethers";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import DashboardNav from "../../../components/dashboard/DashboardNav";
import RegisterUser from "../../../components/dashboard/RegisterUser";
import DashboardNavbar from "../../../components/DashboardNavbar";
import ChatSection from "../../../components/discussions/chat";
import { useDapp } from "../../../contexts/DappContext";
import contractAbi from "../../../utils/ABIs/LearnDAOGovernor.json";
import { CONTRACT_ADDRESS } from "../../../utils/constants";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const DashboardIndex = () => {
  const { isAuthenticated, user, isInitializing, isInitialized, Moralis } =
    useMoralis();
  const { isWeb3Enabled } = useDapp();
  const router = useRouter();
  const { id } = router.query;
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [proposal, setProposal] = React.useState<any>();
  const [value, setValue] = useState("");
  const [file, setFile] = useState<any>();

  // useEffect(() => {
  //   if (isInitialized && (!isAuthenticated || !user)) {
  //     router.replace("/");
  //   }
  // }, [isAuthenticated]);

  useEffect(() => {
    if (isInitialized && isWeb3Enabled) getProposla();
  }, [isInitialized, isWeb3Enabled]);

  const getProposla = async () => {
    const Proposals = Moralis.Object.extend("Proposals");
    const query = new Moralis.Query(Proposals);
    var data = await query.get(id.toString());

    const Content = Moralis.Object.extend("Content");
    const contentQuery = new Moralis.Query(Content);
    var res = await contentQuery
      .equalTo("proposalMoralisId", id.toString())
      .find();

    setValue(res[0]?.get("content") ?? "");
    setProposal(data);
  };

  if (isInitializing) {
    return <span>Loading...</span>;
  }

  const handleSaveData = async () => {
    try {
      setBtnLoading(true);
      const Content = Moralis.Object.extend("Content");
      const query = new Moralis.Query(Content);
      var res = await query.equalTo("proposalMoralisId", id.toString()).find();
      console.log("res :>> ", res);
      if (res.length === 0) {
        const content = new Moralis.Object("Content");
        content.set("proposalMoralisId", id.toString());
        content.set("title", proposal.get("title"));
        content.set("content", value);
        content.set("category", proposal.get("category"));
        content.set("mode", "SAVED");
        await content.save();
      } else {
        res[0].set("content", value);
        res[0].set("mode", "SAVED");
        await res[0].save();
      }
      setBtnLoading(false);
    } catch (e) {
      console.log("e :>> ", e);
      alert("Oops");
    }
  };

  const handleSubmitData = async () => {
    try {
      setBtnLoading(true);

      const ipfsfile = new Moralis.File(`${proposal.id}-banner`, file);
      await ipfsfile.saveIPFS();

      const signer = Moralis.web3.getSigner();
      var user = proposal.get("user");
      const User = Moralis.Object.extend("User");
      const userQuery = new Moralis.Query(User);
      var userRes = await userQuery.equalTo("username", user).first();
      var address = userRes.toJSON().accounts[0];

      var learnDaoContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      );

      var txn = await learnDaoContract.disburseIncentive(
        proposal.id,
        address,
        ethers.utils.parseEther(proposal.get("incentive"))
      );
      await txn.wait();
      const Content = Moralis.Object.extend("Content");
      const query = new Moralis.Query(Content);
      var res = await query.equalTo("proposalMoralisId", id.toString()).find();
      if (res.length > 0) {
        res[0].set("content", value);
        res[0].set("bannerImage", ipfsfile.url({ forceSecure: true }));
        res[0].set("mode", "SUBMITTED");
        res[0].set("author", user);
        res[0].set("authorAddress", address);
      }
      await res[0].save();
      setBtnLoading(false);
      router.replace("/dashboard/my-drafts");
    } catch (e) {
      console.log("e :>> ", e);
      setBtnLoading(false);
      alert("Oops");
    }
  };

  const getCode = (arr = []) =>
    arr
      .map((dt) => {
        if (typeof dt === "string") {
          return dt;
        }
        if (dt.props && dt.props.children) {
          return getCode(dt.props.children);
        }
      })
      .filter(Boolean)
      .join("");

  if (isInitializing) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <Head>
        <title>LearnDAO - Dashboard</title>
      </Head>
      <DashboardNavbar />
      {isAuthenticated && user?.getEmail() === undefined ? (
        <RegisterUser />
      ) : (
        <div className="mx-auto py-10 max-w-6xl flex flex-row items-start justify-center">
          <DashboardNav />
          {isAuthenticated ? (
            <>
              <div className="w-3/4 flex flex-col justify-start items-start">
                <span className="text-white font-extrabold text-3xl text-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-500">
                    Draft
                  </span>
                </span>
                <div className="flex flex-col justify-start mt-5 w-full space-y-5">
                  <span className="text-white font-extrabold text-3xl">
                    {proposal?.get("title")}
                  </span>

                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    htmlFor="user_avatar"
                  >
                    Upload file
                  </label>
                  <input
                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="user_avatar_help"
                    id="user_avatar"
                    type="file"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                  <div
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="user_avatar_help"
                  >
                    A profile picture is useful to confirm your are logged into
                    your account
                  </div>

                  <div className="mt-5">
                    <MDEditor
                      onChange={(newValue = "") => setValue(newValue)}
                      textareaProps={{
                        placeholder: "Write you tutorial description here.",
                      }}
                      height={400}
                      value={value}
                      preview="edit"
                      className="text-red-500"
                      previewOptions={{
                        components: {
                          code: ({
                            inline,
                            children = [],
                            className,
                            ...props
                          }) => {
                            const code = getCode(children);
                            if (
                              typeof code === "string" &&
                              typeof className === "string" &&
                              /^language-mermaid/.test(
                                className.toLocaleLowerCase()
                              )
                            ) {
                              const Elm = document.createElement("div");
                              Elm.id = "demo";
                              const svg = mermaid.render("demo", code);
                              return (
                                <code
                                  dangerouslySetInnerHTML={{ __html: svg }}
                                />
                              );
                            }
                            return (
                              <code className={String(className)}>
                                {children}
                              </code>
                            );
                          },
                        },
                      }}
                    />
                  </div>

                  <div className="mt-8 mb-5 flex flex-row space-x-5">
                    <button
                      disabled={btnLoading}
                      onClick={() => handleSaveData()}
                      type="submit"
                      className={`${
                        btnLoading && "opacity-30 cursor-not-allowed"
                      } rounded-full w-full text-white text-base bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 focus:ring-4 focus:ring-purple-200 font-medium px-5 py-2.5 text-center`}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleSubmitData()}
                      disabled={btnLoading}
                      type="submit"
                      className={`${
                        btnLoading && "opacity-30 cursor-not-allowed"
                      } rounded-full w-full text-white text-base bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 focus:ring-4 focus:ring-purple-200 font-medium px-5 py-2.5 text-center`}
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div className="mt-6 w-full">
                  <ChatSection roomId={id.toString()} />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <span className="text-center text-3xl text-white font-bold mt-20">
                Please Connect
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DashboardIndex;
