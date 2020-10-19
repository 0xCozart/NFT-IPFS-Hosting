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
    let result;

    it("creates images", async () => {
      result = await tgthr.uploadImage();
      let image = await tgthr.images(1);
      console.log(image);
    });
  });
});
