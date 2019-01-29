const { ether, shouldFail, time } = require("openzeppelin-test-helpers");

const VrParkToken = artifacts.require("VrParkToken");
const VrParkIcoStep = artifacts.require("VrParkIcoStep");
const BN = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();

contract("VrParkIcoStep", async function([ owner, wallet, investor ]) {

    const TOTAL_TOKENS = ether('200000000');
    const SINGLE_TOKEN = new BN("1e18");
    const SINGLE_ETHER = ether('1');
    const RATE = new BN(1);

    const GOAL = ether('3000000');

    before(async function() {
        await time.advanceBlock();
    });

    beforeEach(async function() {
        this.openingTime = (await time.latest()).add(time.duration.hours(1));
        this.closingTime = this.openingTime.add(time.duration.days(30));
        this.afterClosingTime = this.closingTime.add(time.duration.seconds(1));

        this.token = await VrParkToken.new(TOTAL_TOKENS);
        this.ico = await VrParkIcoStep.new(this.openingTime, this.closingTime, RATE, GOAL, wallet, this.token.address);

	this.token = await VrParkToken.at(await this.ico.token());
	await this.token.addMinter(this.ico.address);
    });

    it("should create contract with correct parameters", async function() {
        this.ico.should.exist;
        this.token.should.exist;

	this.openingTime.should.be.bignumber.equal(await this.ico.openingTime());
	this.closingTime.should.be.bignumber.equal(await this.ico.closingTime());
        wallet.should.be.equal(await this.ico.wallet());
    });

    it("should mint tokens for investor on crowdsale", async function() {
        await time.increaseTo(this.openingTime);
	await this.ico.sendTransaction({ value: SINGLE_ETHER, from: investor }).should.be.fulfilled;
    });

    it("should revert if crowdsale is not started or over", async function() {
        await shouldFail.reverting(this.ico.send(SINGLE_ETHER, { from: investor }));
        await time.increaseTo(this.openingTime);

	await this.ico.send(SINGLE_ETHER, { from: owner }).should.be.fulfilled;

        await time.increaseTo(this.afterClosingTime);
        await shouldFail.reverting(this.ico.send(SINGLE_ETHER, { from: investor }));
    });

    it("should revert if total investments are more than goal", async function() {
        await time.increaseTo(this.openingTime);
        await shouldFail.reverting(this.ico.send(GOAL.add(SINGLE_ETHER)));
    });

    it("should accept investments if goal is not reached", async function() {
        await time.increaseTo(this.openingTime);
        this.ico.send(GOAL.sub(SINGLE_ETHER)).should.be.fulfilled;
        await this.ico.send(SINGLE_ETHER).should.be.fulfilled;
    });
});

