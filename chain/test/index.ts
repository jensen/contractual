import { expect } from "chai";
import { ethers } from "hardhat";

const sha256Hash =
  "0xbaaeff5a049931146a5b39dac96a064c85e64291e6abb392170bcd78f4738ea2";

describe("Agreement", function () {
  it("Should allow one user to create the contract and another to sign it", async function () {
    const [owner, other] = await ethers.getSigners();

    const Agreement = await ethers.getContractFactory("Agreement");
    const agreement = await Agreement.deploy(owner.address, sha256Hash);
    await agreement.deployed();

    expect(await agreement.getHashed()).to.equal(sha256Hash);

    const firstSignerTx = await agreement.connect(owner).sign(sha256Hash);

    await firstSignerTx.wait();

    const secondSignerTx = await agreement.connect(other).sign(sha256Hash);

    await secondSignerTx.wait();

    expect(await agreement.getSignees()).to.deep.equal([
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    ]);
  });

  it("Should now allow the same user to sign the contract twice", async function () {
    const [owner] = await ethers.getSigners();

    const Agreement = await ethers.getContractFactory("Agreement");
    const agreement = await Agreement.deploy(owner.address, sha256Hash);
    await agreement.deployed();

    const signerTx = await agreement.sign(sha256Hash);

    await signerTx.wait();

    await expect(agreement.sign(sha256Hash)).to.be.reverted;

    expect(await agreement.getSignees()).to.deep.equal([
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    ]);
  });

  it("Should not allow someone to sign with the incorrect hash", async function () {
    const [owner, other] = await ethers.getSigners();

    const Agreement = await ethers.getContractFactory("Agreement");
    const agreement = await Agreement.deploy(owner.address, sha256Hash);

    await agreement.deployed();

    await expect(
      agreement.sign(
        "0xb4dc0d3a049931146a5b39dac96a064c85e64291e6abb392170bcd78f4738ea2"
      )
    ).to.be.reverted;
  });

  it("Should emit an event when a new signee is added", async function () {
    const [owner, other] = await ethers.getSigners();

    const Agreement = await ethers.getContractFactory("Agreement");
    const agreement = await Agreement.deploy(owner.address, sha256Hash);

    await agreement.deployed();

    await expect(agreement.connect(other).sign(sha256Hash))
      .to.emit(agreement, "AgreementSigned")
      .withArgs(sha256Hash, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
  });
});
