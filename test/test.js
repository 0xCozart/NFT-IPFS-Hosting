const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

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
      assert.equal(event.hash, hash, 'Hash is incorrect');
      assert.equal(event.description, 'Image description', 'Description id incorrect');
      assert.equal(event.tipAmount, 0, 'Tip amount is incorrect');
      assert.equal(event.author, author, 'Author is incorrect')


      await tgthr.uploadImage("", 'Image description', {from: author}).should.be.rejected;
    });

    it('lists images', async() => {
      const image = await tgthr.images(imageCount)

      assert.equal(imageCount, 1);
      assert.equal(image.hash, hash, 'Hash is incorrect');
      assert.equal(image.description, 'Image description', 'Description id incorrect');
      assert.equal(image.tipAmount, 0, 'Tip amount is incorrect');
      assert.equal(image.author, author, 'Author is incorrect')

    })

    it('allows users to tip images', async() => {
      // Track authors balance before tip
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await tgthr.tipImageOwner(imageCount, {from:tipper, value: web3.utils.toWei("1", "ether")})

      // Success 
      const event = result.logs[0].args

      assert.equal(imageCount, 1);
      assert.equal(event.hash, hash, 'Hash is incorrect');
      assert.equal(event.description, 'Image description', 'Description id incorrect');
      assert.equal(event.tipAmount, "1000000000000000000", 'Tip amount is incorrect');
      assert.equal(event.author, author, 'Author is incorrect')

      // Checks that the author received funds
      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipForImageOwner;
      tipForImageOwner = web3.utils.toWei("1", "Ether")
      tipForImageOwner = new web3.utils.BN(tipForImageOwner)

      const expectedBalance = oldAuthorBalance.add(tipForImageOwner)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // Failure: Tries to tip a image that does not exist
      await tgthr.tipImageOwner(99, {from:tipper, value: web3.utils.toWei("1", "ether")}).should.be.rejected;
    })
  });
});
