import { Signer } from "ethers";
import { ethers } from "hardhat";

const main = async () => {
  let accounts: Signer[];
  accounts = await ethers.getSigners();

  const daiTokenFactory = await ethers.getContractFactory("Dai");
  const daiTokenContract = await daiTokenFactory.deploy();
  await daiTokenContract.deployed();
  console.log(daiTokenContract.address);
  var balance = await daiTokenContract.balanceOf(accounts[0].getAddress());
  console.log("balance", balance);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(`err`, err);
    process.exit(1);
  }
};

runMain();

// 1- 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
// 2- 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
// 3- 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
// 4- 0x90f79bf6eb2c4f870365e785982e1f101e93b906
// 5- 0x15d34aaf54267db7d7c367839aaf71a00a2c6a65
