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
        '0x6e9eeef9b86c9537201d06ece596377f880f2193e6ab1da5c992128cd6b735e5',
        '0x7951296dae56d7f06c49baaa6b879179f2e390db07b93cce65bf51b041b9715b',
        '0x087957d9046badb78c3179cbe4f563e8c667134425b731b44b79a87ab47cc2ef',
        '0xa2da8d777b012739546460db7de20e2474b02299816e42974a1cf66b26c6a788',
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
