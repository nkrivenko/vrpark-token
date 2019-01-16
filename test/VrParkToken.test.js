import advanceBlock from "./helpers/advanceToBlock";
import EVMRevert from "./helpers/EVMRevert";
import ether from "./helpers/ether";

const VrParkToken = artifacts.require("VrParkToken");
const BN = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();

contract("VrParkToken", async function([ owner, token, investor ]) {

    const NAME = "VR";
    const SYMBOL = "VR";
    const DECIMALS = new BN(18);
    const TOTAL_TOKENS = new BN("2e26");

    const SINGLE_TOKEN = new BN("1e18");

    before(async function() {
        await advanceBlock();
    });

    beforeEach(async function() {
        this.token = await VrParkToken.new(TOTAL_TOKENS);
    });

    it("should create token with correct parameters", async function() {
        this.token.should.exist;

	NAME.should.be.equal(await this.token.name());
	SYMBOL.should.be.equal(await this.token.symbol());
        DECIMALS.should.be.bignumber.equal(await this.token.decimals());
	TOTAL_TOKENS.should.be.bignumber.equal(await this.token.cap());
    });

    it("should mint no more tokens than cap", async function() {
        this.token.mint(investor, TOTAL_TOKENS).should.be.fulfilled;
    });

    it("should not mint more tokens than cap", async function() {
        this.token.mint(investor, TOTAL_TOKENS.add(new BN(1))).should.be.rejectedWith(EVMRevert);
    });
    
    it("should allow to mint tokens only to Minters", async function() {
        this.token.mint(investor, SINGLE_TOKEN, { from: investor }).should.be.rejectedWith(EVMRevert);
    });

    it("should allow to add minters", async function() {
        this.token.addMinter(investor, { from: owner }).should.be.fulfilled;

	(await this.token.isMinter(investor)).should.be.true;
    });

    it("should allow to add minters only to the other minters", async function() {
        this.token.addMinter(investor, { from: investor }).should.be.rejectedWith(EVMRevert);
    });

    it("should allow to remove minters", async function() {
        this.token.addMinter(investor, { from: owner }).should.be.fulfilled;
        await this.token.removeMinter(investor, { from: owner });

	(await this.token.isMinter(investor)).should.be.false;
    });

    it("should allow to remove minters only to the other minters", async function() {
        this.token.removeMinter(investor, { from: investor }).should.be.rejectedWith(EVMRevert);
    });
});

