import { ethers } from "hardhat";

async function main() {
  const lockedAmount = ethers.utils.parseEther("2");

  const ChristmasPresent = await ethers.getContractFactory("ChristmasPresent");
  const lock = await ChristmasPresent.deploy({
    value: lockedAmount,
  });

  await lock.deployed();

  console.log(`ChristmasPresent with 2 ETH deployed to ${lock.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
