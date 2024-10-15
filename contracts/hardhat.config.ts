import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0xa4b2ed0a383e8ad55731dbeda22c026358fe226ea23ca632cd8b320e7374f9de',
        '0x288801260ebda9dbaf4efe669414d8a6a5c4d4fd8a503eeaacc3aae3ac983225',
        '0xf5c32ab1dc53acc169d7cc8bf5698a808a6ed3343c6c096a6615069be6d00e0a',
        '0x6d0d0a9e6fb448e7c40ace41d1be371d60d77c1bdc1affdb2b65b7d2738c762a',
      ]
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

export default config;
