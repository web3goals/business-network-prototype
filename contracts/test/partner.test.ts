import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as hre from "hardhat";
import { Contract, Provider, Wallet, utils } from "zksync-web3";
import { zkSyncTestnet } from "../hardhat.config";
import { expect } from "chai";
import { ethers } from "ethers";

const RICH_WALLET_PK_1 =
  "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"; // 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049
const RICH_WALLET_PK_2 =
  "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3"; // 0xa61464658AfeAf65CccaaFD3a512b69A83B77618

describe("Partner", function () {
  let provider: Provider;
  let partnerContract: Contract;
  let partnerWallet: Wallet;
  let userWallet: Wallet;

  before(async function () {
    provider = new Provider(zkSyncTestnet.url);
    // Init wallets
    partnerWallet = new Wallet(RICH_WALLET_PK_1, provider);
    userWallet = new Wallet(RICH_WALLET_PK_2, provider);
    // Deploy contract
    const deployer = new Deployer(hre, partnerWallet);
    const artifact = await deployer.loadArtifact("Partner");
    partnerContract = await deployer.deploy(artifact, ["ipfs://..."]);
    // Send ETH to contract
    await (
      await deployer.zkWallet.sendTransaction({
        to: partnerContract.address,
        value: ethers.utils.parseEther("0.06"),
      })
    ).wait();
  });

  it("Should have correct data", async function () {
    expect(await partnerContract.details()).to.be.equal("ipfs://...");
    expect((await partnerContract.getFeedback()).length).to.be.equal(0);
  });

  it("Should post feedback", async function () {
    await (await partnerContract.postFeedback("Great artist!")).wait();
    expect((await partnerContract.getFeedback()).length).to.be.equal(1);
  });

  it("Should provide gasless transaction for post feedback", async function () {
    // Define gas price
    const gasPrice = await provider.getGasPrice();

    // Encode paymaster flow's input
    const paymasterParams = utils.getPaymasterParams(partnerContract.address, {
      type: "General",
      innerInput: new Uint8Array(),
    });

    // Estimate gas fee for transaction
    const gasLimit = await partnerContract
      .connect(userWallet)
      .estimateGas.postFeedback("Great person!", {
        customData: {
          gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
          paymasterParams: paymasterParams,
        },
      });
    const fee = gasPrice.mul(gasLimit.toString());
    console.log("Transaction fee estimation is:", fee.toString());

    // Check balances
    console.log(
      "Contract balance:",
      (await provider.getBalance(partnerContract.address)).toString()
    );
    console.log(
      "User balance:",
      (await provider.getBalance(userWallet.address)).toString()
    );

    // Check feedback number
    console.log(
      "Feedback number:",
      (await partnerContract.getFeedback()).length
    );

    // Send transaction using paymaster
    await (
      await partnerContract.connect(userWallet).postFeedback("Great person!", {
        customData: {
          paymasterParams: paymasterParams,
          gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        },
      })
    ).wait();
    console.log("Feedback posted");

    // Check balances
    console.log(
      "Contract balance:",
      (await provider.getBalance(partnerContract.address)).toString()
    );
    console.log(
      "User balance:",
      (await provider.getBalance(userWallet.address)).toString()
    );

    // Check feedback number
    console.log(
      "Feedback number:",
      (await partnerContract.getFeedback()).length
    );
  });
});
