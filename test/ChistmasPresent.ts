import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ChristmasPresent", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployChristmasPresentFixture() {
    const CHRISTMAS_TIMESTAMP = 1671922800;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const christmasTimestamp = CHRISTMAS_TIMESTAMP;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ChristmasPresent = await ethers.getContractFactory(
      "ChristmasPresent"
    );
    const lock = await ChristmasPresent.deploy({
      value: lockedAmount,
    });

    return { lock, christmasTimestamp, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { lock, christmasTimestamp } = await loadFixture(
        deployChristmasPresentFixture
      );

      expect(await lock.unlockTime()).to.equal(christmasTimestamp);
    });

    it("Should set the right owner", async function () {
      const { lock, owner } = await loadFixture(deployChristmasPresentFixture);

      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { lock, lockedAmount } = await loadFixture(
        deployChristmasPresentFixture
      );

      expect(await ethers.provider.getBalance(lock.address)).to.equal(
        lockedAmount
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        const { lock } = await loadFixture(deployChristmasPresentFixture);

        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't open your present before Christmas"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { lock, christmasTimestamp, otherAccount } = await loadFixture(
          deployChristmasPresentFixture
        );

        await time.increaseTo(christmasTimestamp);

        // We use lock.connect() to send a transaction from another account
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You aren't the recipient of this present"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { lock, christmasTimestamp } = await loadFixture(
          deployChristmasPresentFixture
        );

        // Transactions are sent using the first signer by default
        await time.increaseTo(christmasTimestamp);

        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { lock, christmasTimestamp, lockedAmount } = await loadFixture(
          deployChristmasPresentFixture
        );

        await time.increaseTo(christmasTimestamp);

        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { lock, christmasTimestamp, lockedAmount, owner } =
          await loadFixture(deployChristmasPresentFixture);

        await time.increaseTo(christmasTimestamp);

        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});
