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
        '0x7e78fda61cc4c27cd1f6e2b4ff83b2f7a53eebb428b4527d276ea706d191088d',
        '0x9511b05b880d4cbe10d74e0c8e775ba204773a91811ddc293847f8724d5f70e3',
        '0x444b0091bc73ffa9578e4bc6725e259ed6b435acb73a6e69a1dfc0570728f243',
        '0x4866ce1cd1fefe6c5b48291de75abd612afec5bdbc9152da3549c1de12743056',
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
