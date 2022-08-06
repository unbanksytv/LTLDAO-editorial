declare const window: any;
import { ethers } from "ethers";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useDapp } from "../../contexts/DappContext";
import learnDaoAbi from "../../utils/ABIs/LearnDAOGovernor.json";
import {
  categories,
  CONTRACT_ADDRESS,
  DAI_ADDRESS,
  LDAO_ADRESS,
} from "../../utils/constants";
import {
  checkTokeAllowance,
  getTokenBalance,
  tokenApprove,
} from "../../utils/helper";

const RegisterUser = () => {
  const { isWeb3Enabled } = useDapp();
  const { web3, user, setUserData } = useMoralis();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userDaiBalance, setUserDaiBalance] = useState<number>(0);
  const [userLDAOBalance, setUserLDAOBalance] = useState<number>(0);
  const [userDaiAllowance, setUserDaiAllowance] = useState<number>(0);
  const [currentState, setCurrentState] = useState<string>("ONE");
  const [daiInput, setDaiInput] = useState("");
  const [stateOneButton, setStateOneButton] = useState("Approve DAI");
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (isWeb3Enabled && user) {
      getDaiBalance();
      checkAllowance();
      getLDAOBalance();
    }
  }, [isWeb3Enabled, user]);

  const getDaiBalance = async () => {
    var daiBalance = await getTokenBalance(
      web3,
      DAI_ADDRESS,
      user.toJSON().accounts[0],
      true
    );
    setUserDaiBalance(daiBalance);
  };

  const getLDAOBalance = async () => {
    var ldaoBalance = await getTokenBalance(
      web3,
      LDAO_ADRESS,
      user.toJSON().accounts[0],
      true
    );
    if (parseFloat(ldaoBalance) > 20.0) {
      setCurrentState("TWO");
    }
    setUserLDAOBalance(ldaoBalance);
  };

  const checkAllowance = async () => {
    var allowance = await checkTokeAllowance(
      web3,
      DAI_ADDRESS,
      user.toJSON().accounts[0],
      CONTRACT_ADDRESS
    );
    setUserDaiAllowance(Number(allowance));
  };

  const approveDai = async () => {
    try {
      if (parseInt(daiInput) < 10) {
        alert("Please enter a value greater than 10");
      } else {
        setBtnLoading(true);
        await tokenApprove(web3, DAI_ADDRESS, CONTRACT_ADDRESS, daiInput);
        setTimeout(async () => {
          setStateOneButton("Swap for LDAO");
          setBtnLoading(false);
          checkAllowance();
        }, 3000);
      }
    } catch (e) {
      setBtnLoading(false);
      setStateOneButton("Approve DAI");
    }
  };

  const becomeMember = async () => {
    if (parseInt(daiInput) < 10) {
      alert("Please enter a value greater than 10");
    } else {
      setBtnLoading(true);
      const signer = web3.getSigner();
      const learnDaoContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        learnDaoAbi.abi,
        signer
      );
      var txn = await learnDaoContract.addMember(
        ethers.utils.parseEther(daiInput).toString()
      );
      await txn.wait();
      setBtnLoading(false);
      setCurrentState("TWO");
    }
  };

  const addLDAOToken = async () => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: LDAO_ADRESS, // The address that the token is at.
            symbol: "LDAO", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserDataSubmit = async (value: {
    email: string;
    username: string;
    bio: string;
  }) => {
    await setUserData({
      email: value.email,
      username: value.username,
      bio: value.bio,
    });
    user.set("interests", handleUserDataSubmit);
    await user.save();
  };

  const renderStepOne = () => {
    return (
      <div className="flex flex-col">
        <span className="text-white opacity-60 font-bold text-xl text-center mt-10">
          You will need to buy minimum 10 DAI worth of LDAO governance token to
          be a member of the DAO.
        </span>
        <div className="mb-6 flex flex-col justify-end">
          <span
            className="text-right text-white font-display font-bold underline text-sm mb-2 mr-3 cursor-pointer"
            onClick={() => {
              setDaiInput(userDaiBalance.toString());
            }}
          >
            Max - {userDaiBalance} DAI
          </span>
          <div className="relative mt-1">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="rgb(209 213 219)"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <input
              onChange={(e) => {
                setDaiInput(e.target.value);
              }}
              value={daiInput}
              type="text"
              id="email-adress-icon"
              className="font-display py-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Min. 10 DAI"
            />
          </div>
          <span className="pt-3 text-white font-bold font-display">
            10 DAI ~ 100 LDAO
          </span>
          <span className="pt-1 text-white font-bold font-display">
            You will receive 100 LDAO Governance token in return
          </span>
          <span className="pt-1 text-white font-bold font-display">
            You have -{" "}
            <span className="underline">{userLDAOBalance} LDAO </span>
            tokens
          </span>
          <span className="pt-1 text-white font-bold font-display">
            LDAO -{" "}
            <span
              onClick={() => {
                addLDAOToken();
              }}
              className="underline cursor-pointer"
            >
              {LDAO_ADRESS}{" "}
            </span>
          </span>
          <div className="mt-5">
            <button
              onClick={() => {
                if (!btnLoading)
                  if (userDaiAllowance >= 10) {
                    becomeMember();
                  } else {
                    approveDai();
                  }
              }}
              type="button"
              className={`${
                btnLoading && "opacity-30 cursor-not-allowed"
              } rounded-full w-full text-white text-base bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 focus:ring-4 focus:ring-purple-200 font-medium px-5 py-2.5 text-center`}
            >
              {stateOneButton}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStepTwo = () => {
    return (
      <div className="w-3/4 mt-10 mx-auto">
        <span className="text-white opacity-60 font-bold text-lg mt-4text-center">
          This information is shown to public and people can recognize you with
          this information.
        </span>
        <Formik
          initialValues={{ email: "", username: "", bio: "" }}
          validate={(values) => {
            const errors: any = {};
            if (!values.email) {
              errors.email = "Email is required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            } else if (!values.username) {
              errors.username = "Username is required";
            } else if (!values.bio) {
              errors.bio = "Bio is required";
            } else if (values.bio.length > 100) {
              errors.bio = "Bio must be less than 100 characters";
            } else if (values.username.length > 20) {
              errors.username = "Username must be less than 20 characters";
            } else if (values.username.length < 3) {
              errors.username = "Username must be more than 3 characters";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await handleUserDataSubmit(values);
            setSubmitting(false);
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
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-6 mt-5">
                <div className="relative mt-1">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="rgb(209 213 219)"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="email"
                    id="email-adress-icon"
                    className="font-display py-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </div>
                {errors.email && touched.email && (
                  <span className="font-display pt-5 text-red-500 text-sm">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="mb-6">
                <div className="relative mt-1">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="rgb(209 213 219)"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    id="email-adress-icon"
                    className="font-display py-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Choose Username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                  />
                </div>
                {errors.username && touched.username && (
                  <span className="font-display pt-5 text-red-500 text-sm">
                    {errors.username}
                  </span>
                )}
              </div>
              <div className="mb-6">
                <div className="relative mt-1">
                  <textarea
                    rows={4}
                    name="bio"
                    id="email-adress-icon"
                    className="font-display p-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Something about you"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.bio}
                  />
                </div>
                {errors.bio && touched.bio && (
                  <span className="font-display pt-5 text-red-500 text-sm">
                    {errors.bio}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-display mb-8 mt-3 text-center">
                  Choose any five categories you are interested in
                </span>
                <div>
                  {categories.map((category) => (
                    <div
                      onClick={() => {
                        if (selectedCategories.includes(category)) {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category)
                          );
                        } else {
                          if (selectedCategories.length < 5)
                            setSelectedCategories([
                              ...selectedCategories,
                              category,
                            ]);
                        }
                      }}
                      className={`cursor-pointer mb-2 rounded-full relative inline-flex items-center justify-center p-0.5 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800`}
                    >
                      <span
                        className={`rounded-full relative px-5 py-2.5 transition-all ease-in duration-75 ${
                          selectedCategories.includes(category)
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
              <div className="mt-8 mb-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    btnLoading && "opacity-30 cursor-not-allowed"
                  } rounded-full w-full text-white text-base bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 focus:ring-4 focus:ring-purple-200 font-medium px-5 py-2.5 text-center`}
                >
                  Get Started
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    );
  };

  return (
    <>
      <div className="mx-auto py-10 max-w-3xl flex flex-row items-center justify-center">
        <div className="flex flex-col">
          <span className="text-white font-extrabold text-5xl text-center">
            Just need few information to get{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-500">
              Started
            </span>
          </span>
          {currentState === "ONE" ? renderStepOne() : renderStepTwo()}
        </div>
      </div>
    </>
  );
};

export default RegisterUser;
