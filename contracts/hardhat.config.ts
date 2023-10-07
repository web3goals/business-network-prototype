import type { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";

import "@matterlabs/hardhat-zksync-verify";

// Dynamically changes endpoints
export const zkSyncTestnet =
  process.env.NODE_ENV == "testnet"
    ? {
        url: "https://zksync2-testnet.zksync.dev",
        ethNetwork: "goerli",
        zksync: true,
        verifyURL:
          "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
      }
    : {
        url: "http://127.0.0.1:3050",
        ethNetwork: "http://127.0.0.1:8545",
        zksync: true,
      };

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet,
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
