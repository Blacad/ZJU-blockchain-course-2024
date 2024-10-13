import { ethers } from "hardhat";

async function main() {
  const BuyMyRoom = await ethers.getContractFactory("BuyMyRoom");
  const buyMyRoom = await BuyMyRoom.deploy();
  await buyMyRoom.deployed();
  const myERC721 = await buyMyRoom.myERC721();
  console.log(`BuyMyRoom deployed to ${buyMyRoom.address}`)
  console.log(`myERC721 deployed to ${myERC721}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});