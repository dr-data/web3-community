require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: [1000, 2000]
      }
    },
    mumbai_testnet: {
      url: process.env.MUMBAI_TESTNET_RPC_URL !== undefined ? process.env.MUMBAI_TESTNET_RPC_URL : "",
      accounts: process.env.MUMBAI_TESTNET_PRIVATE_KEY !== undefined ? [process.env.MUMBAI_TESTNET_PRIVATE_KEY] : [],
    },
    optimism_testnet: {
      url: process.env.OPTIMISM_TESTNET_RPC_URL !== undefined ? process.env.OPTIMISM_TESTNET_RPC_URL : "",
      accounts: process.env.OPTIMISM_TESTNET_PRIVATE_KEY !== undefined ? [process.env.OPTIMISM_TESTNET_PRIVATE_KEY] : [],
    },
  }
};
