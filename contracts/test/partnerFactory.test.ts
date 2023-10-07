import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { ethers } from "ethers";
import * as hre from "hardhat";
import { Contract, Provider, Wallet } from "zksync-web3";
import { zkSyncTestnet } from "../hardhat.config";

const RICH_WALLET_PK_1 =
  "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"; // 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049
const RICH_WALLET_PK_2 =
  "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3"; // 0xa61464658AfeAf65CccaaFD3a512b69A83B77618

describe("PartnerFactory", function () {
  let provider: Provider;
  let partnerFactoryContract: Contract;
  let partnerWallet: Wallet;
  let userWallet: Wallet;

  before(async function () {
    provider = new Provider(zkSyncTestnet.url);
    // Init wallets
    partnerWallet = new Wallet(RICH_WALLET_PK_1, provider);
    userWallet = new Wallet(RICH_WALLET_PK_2, provider);
    // Deploy contract
    const deployer = new Deployer(hre, partnerWallet);
    const artifact = await deployer.loadArtifact("PartnerFactory");
    partnerFactoryContract = await deployer.deploy(artifact, []);
  });

  it("Should create partner contract and send ethers to it", async function () {
    // Become partner
    await (
      await partnerFactoryContract.becomePartner("ipfs://...", {
        value: ethers.utils.parseEther("0.04"),
      })
    ).wait();
    console.log("Partner contract is created");

    // Get partner contract
    const partner = await partnerFactoryContract.getPartner(
      partnerWallet.address
    );
    console.log("partner", partner);

    // Check partner contract balance
    console.log(
      "Partner contract balance:",
      (await provider.getBalance(partner[1])).toString()
    );
  });
});
