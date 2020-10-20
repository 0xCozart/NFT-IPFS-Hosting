/* eslint-disable no-undef */
const Tgthr = artifacts.require("./Tgthr.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Tgthr", ([deployer, author, tipper]) => {
  let tgthr;

  before(async () => {
    tgthr = await Tgthr.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await tgthr.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await tgthr.name();
      assert.equal(name, "Tgthr");
    });
  });

  describe("images", async () => {
    let result, imageCount;
    const hash = "test_hash"

    before(async() => {
      result = await tgthr.uploadImage(hash, 'Image description', {from: author})
      imageCount = await tgthr.imageCount()
    })

    it("creates images", async () => {

      const event = result.logs[0].args

      assert.equal(imageCount, 1);
      assert.equal(event.hash, hash, 'hash is correct');
      assert.equal(event.description, 'Image description', 'Description id correct');
      assert.equal(event.tipAmount, '0', 'Tip amount is correct');
      assert.equal(event.author, author, 'author is correct')

    });
  });
});
