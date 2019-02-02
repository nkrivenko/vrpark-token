const { ether, shouldFail, time } = require("openzeppelin-test-helpers");

const VrParkToken = artifacts.require("VrParkToken");
const VrParkIcoStep = artifacts.require("VrParkIcoStep");
const ExchangeInteractorStub = artifacts.require("ExchangeInteractorStub");
const BN = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();

contract("VrParkIcoStep", async function([ owner, wallet, investor ]) {

    const TOTAL_TOKENS = ether('20000000000000000');
    const SINGLE_TOKEN = new BN("1e18");
    const SINGLE_ETHER = ether('1');
    const BONUS_RATE = new BN(130);
    const WHITELIST_THRESHOLD = ether('10');

    const GOAL = ether('3000000');
    const USDETH = new BN(150);
    const USDVR = new BN(1);
    const ONE_HUNDRED_PERCENT = new BN(100);

    before(async function() {
        await time.advanceBlock();
    });

    beforeEach(async function() {
        this.openingTime = (await time.latest()).add(time.duration.hours(1));
        this.closingTime = this.openingTime.add(time.duration.days(30));
        this.afterClosingTime = this.closingTime.add(time.duration.seconds(1));

        this.token = await VrParkToken.new(TOTAL_TOKENS);
        this.interactor = await ExchangeInteractorStub.new(USDETH);
        this.ico = await VrParkIcoStep.new(this.openingTime, this.closingTime, USDVR, GOAL, BONUS_RATE, WHITELIST_THRESHOLD, wallet, this.token.address, this.interactor.address);

	this.token = await VrParkToken.at(await this.ico.token());
	this.interactor = await ExchangeInteractorStub.at(await this.ico.interactor());
	await this.token.addMinter(this.ico.address);
    });

    it("should create contract with correct parameters", async function() {
        this.ico.should.exist;
        this.token.should.exist;
	this.interactor.should.exist;

	this.openingTime.should.be.bignumber.equal(await this.ico.openingTime());
	this.closingTime.should.be.bignumber.equal(await this.ico.closingTime());
        wallet.should.be.equal(await this.ico.wallet());
    });

    it("should mint tokens for investor on crowdsale", async function() {
        await time.increaseTo(this.openingTime);
	await this.ico.sendTransaction({ value: SINGLE_ETHER, from: investor }).should.be.fulfilled;
    });

    it("should mint certain amount of tokens", async function() {
        await time.increaseTo(this.openingTime);
        const expectedAmountOfTokens = SINGLE_ETHER.mul(USDETH).mul(BONUS_RATE).div(USDVR).div(ONE_HUNDRED_PERCENT);

	const oldBalance = await this.token.balanceOf(investor);
	await this.ico.sendTransaction({ value: SINGLE_ETHER, from: investor }).should.be.fulfilled;
	const newBalance = await this.token.balanceOf(investor);

	const diff = newBalance.sub(oldBalance);

        await diff.should.be.bignumber.equal(expectedAmountOfTokens);
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
        await this.ico.addWhitelisted(investor);

        await shouldFail.reverting(this.ico.send(GOAL.add(SINGLE_ETHER)));
    });

    it("should accept investments if goal is not reached", async function() {
        await time.increaseTo(this.openingTime);
        await this.ico.addWhitelisted(investor);

        await this.ico.send(GOAL.sub(SINGLE_ETHER), { from: investor }).should.be.fulfilled;

        await this.ico.send(SINGLE_ETHER, { from: investor }).should.be.fulfilled;
    });

    it("should not receive any investments while paused", async function() {
        await time.increaseTo(this.openingTime);

        await this.ico.send(SINGLE_ETHER).should.be.fulfilled;
        await this.ico.pause();

	(await this.ico.paused()).should.be.true;

	await shouldFail.reverting(this.ico.send(SINGLE_ETHER));
    });

    it("should resume receiving investments after unpaused", async function() {
        await time.increaseTo(this.openingTime);

        await this.ico.pause();
	(await this.ico.paused()).should.be.true;

	await shouldFail.reverting(this.ico.send(SINGLE_ETHER));

        await this.ico.unpause();
	(await this.ico.paused()).should.be.false;

        await this.ico.send(SINGLE_ETHER).should.be.fulfilled;
    });

    it("should allow to pause only to owner", async function() {
        await shouldFail.reverting(this.ico.pause({ from: investor }));
    });

    it("should accept payments less than threshold if not in whitelist", async function() {
        await time.increaseTo(this.openingTime);
        await this.ico.send(SINGLE_ETHER, { from: investor }).should.be.fulfilled;
    });

    it("should reject payments more or equal to the threshold if not in whitelist", async function() {
        await time.increaseTo(this.openingTime);
        await shouldFail.reverting(this.ico.send(WHITELIST_THRESHOLD, { from: investor }));
    });

    it("should accept payments more or equal to the threshold if in whitelist", async function() {
        await time.increaseTo(this.openingTime);
        await this.ico.addWhitelisted(investor);

        await this.ico.send(WHITELIST_THRESHOLD, { from: investor }).should.be.fulfilled;
    });
});

