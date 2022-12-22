import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      // Replace this with your private key
      accounts: ["0x..."],
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      // Replace this with your private key
      accounts: ["0x..."],
    },
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP,
    enabled: process.env.REPORT_GAS ? true : false,
    gasPriceApi:
      "https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice",
    token: "AVAX",
    currency: "USD",
  },
};

export default config;
