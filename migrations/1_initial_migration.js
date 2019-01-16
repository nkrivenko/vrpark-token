var Migrations = artifacts.require("./Migrations.sol");
var VrParkToken = artifacts.require("./VrParkToken.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(Migrations);

    deployer.deploy(VrParkToken, 2000, { from: accounts[0] });
};
