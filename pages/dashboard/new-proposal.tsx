import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import { encode } from "base-64";
import { ethers } from "ethers";
import { Formik } from "formik";
import mermaid from "mermaid";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import utf8 from "utf8";
import DashboardNav from "../../components/dashboard/DashboardNav";
import RegisterUser from "../../components/dashboard/RegisterUser";
import DashboardNavbar from "../../components/DashboardNavbar";
import contractAbi from "../../utils/ABIs/LearnDAOGovernor.json";
import { contentCategory, CONTRACT_ADDRESS } from "../../utils/constants";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const DashboardIndex = () => {
  const { isAuthenticated, user, isInitializing, isInitialized, Moralis } =
    useMoralis();
  const router = useRouter();
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [btnText, setBtnText] = React.useState("Submit Proposal");
  const [selectedCategory, setSelectedCategory] = React.useState("Tutorial");
  const [value, setValue] = useState("");

  // useEffect(() => {
  //   if (isInitialized && (!isAuthenticated || !user)) {
  //     router.replace("/");
  //   }
  // }, [isAuthenticated]);
  if (isInitializing) {
    return <span>Loading...</span>;
  }

  const handleUserData = async (values: {
    title: string;
    description: string;
    incentive: string;
  }) => {
    try {
      setBtnLoading(true);
      const Proposals = Moralis.Object.extend("Proposals");
      var proposals = new Proposals();
      proposals.set("title", values.title);
      proposals.set("incentive", values.incentive);

      proposals.set("description", values.description);
      proposals.set("category", selectedCategory);
      proposals.set("user", user.getUsername());
      await proposals.save();
      setBtnText("Uploading content to IPFS...");

      const file = new Moralis.File(`${proposals.id}.md`, {
        base64: encode(utf8.encode(value.toString())),
        type: "text/markdown",
      });
      await file.saveIPFS();

      var contentUrl = file.url({
        forceSecure: true,
      });
      proposals.set("content", contentUrl);

      setBtnText("Making contract calls...");

      const signer = Moralis.web3.getSigner();
      var learnDaoContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      );

      const transferCalldata = learnDaoContract.interface.encodeFunctionData(
        "setAcceptedProposal",
        [proposals.id, user.toJSON().accounts[0]]
      );
      var txn = await learnDaoContract.propose(
        [learnDaoContract.address],
        [0],
        [transferCalldata],
        value
      );
      var rc = await txn.wait();
      const event = rc.events.find(
        (event: any) => event.event === "ProposalCreated"
      );
      const [proposalId] = event.args;
      setBtnText("Just there...");
      proposals.set("proposalId", proposalId.toString());
      await proposals.save();

      setTimeout(() => {
        setBtnText("Submit Proposal");

        setValue("");
        setBtnLoading(false);
      }, 1000);
    } catch (e) {
      console.log("e :>> ", e);
      setBtnText("Submit Proposal");
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
              <div className="w-3/4 flex flex-col items-start">
                <span className="text-white font-extrabold text-3xl text-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-500">
                    Create new proposal
                  </span>
                </span>
                <div className="flex flex-col mt-5 w-full space-y-5">
                  <Formik
                    onSubmit={async (values, { resetForm }) => {
                      await handleUserData(values);
                      resetForm();
                    }}
                    initialValues={{
                      title: "",
                      description: "",
                      incentive: "",
                    }}
                    validate={(values) => {
                      const errors: any = {};
                      if (!values.title) {
                        errors.title = "Title is required";
                      }
                      if (!values.incentive) {
                        errors.incentive = "Incentive is required";
                      }
                      if (!values.description) {
                        errors.description = "Description is required";
                      }
                      return errors;
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      isValid,
                      /* and other goodies */
                    }) => (
                      <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="mb-8 mt-5">
                          <span className="text-white font-display text-start">
                            Title
                          </span>
                          <input
                            type="text"
                            name="title"
                            id="title-adress-icon"
                            className="mt-3 font-display py-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder=""
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title}
                          />

                          {errors.title && touched.title && (
                            <span className="font-display pt-5 text-red-500 text-sm">
                              {errors.title}
                            </span>
                          )}
                        </div>
                        <div className="mb-8 mt-5">
                          <span className="text-white font-display text-start">
                            Short Description
                          </span>
                          <input
                            type="text"
                            name="description"
                            id="description-adress-icon"
                            className="mt-3 font-display py-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder=""
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description}
                          />

                          {errors.description && touched.description && (
                            <span className="font-display pt-5 text-red-500 text-sm">
                              {errors.description}
                            </span>
                          )}
                        </div>
                        <div className="mt-5">
                          <MDEditor
                            onChange={(newValue = "") => setValue(newValue)}
                            textareaProps={{
                              placeholder:
                                "Write you tutorial description here.",
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
                                        dangerouslySetInnerHTML={{
                                          __html: svg,
                                        }}
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
                        <div className="flex flex-col mt-6">
                          <span className="text-white font-display mb-3 mt-0 text-start">
                            Choose category
                          </span>
                          <div>
                            {contentCategory.map((category) => (
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedCategory(category);
                                }}
                                className={`cursor-pointer mb-2 rounded-full relative inline-flex items-center justify-center p-0.5 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800`}
                              >
                                <span
                                  className={`rounded-full relative px-5 py-2.5 transition-all ease-in duration-75 ${
                                    selectedCategory === category
                                      ? ""
                                      : "bg-gray-900"
                                  } group-hover:bg-opacity-0`}
                                >
                                  {category}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-display mb-3 mt-5 text-start">
                            How much DAI do you wish to receive as incentive for
                            this tutorial?
                          </span>
                          <div className="mb-5">
                            <input
                              type="text"
                              name="incentive"
                              id="incentive-adress-icon"
                              className="font-display py-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder=""
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.incentive}
                            />

                            {errors.incentive && touched.incentive && (
                              <span className="font-display pt-5 text-red-500 text-sm">
                                {errors.incentive}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-8 mb-5 flex flex-row space-x-5">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${
                              isSubmitting && "opacity-30 cursor-not-allowed"
                            } rounded-full w-full text-white text-base bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 focus:ring-4 focus:ring-purple-200 font-medium px-5 py-2.5 text-center`}
                          >
                            {btnText}
                          </button>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <span className="text-center text-3xl text-white font-bold mt-20">
                Please Connect to create a Proposal
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DashboardIndex;
