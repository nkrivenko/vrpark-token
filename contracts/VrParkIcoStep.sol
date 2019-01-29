pragma solidity 0.5.0;

import "./VrParkToken.sol";

import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract VrParkIcoStep is /*TimedCrowdsale,*/ MintedCrowdsale {

    constructor (uint256 openTime, uint256 closeTime, uint256 rate, address payable wallet, VrParkToken token) public
        // TimedCrowdsale(openTime, closeTime)
	MintedCrowdsale()
        Crowdsale(rate, wallet, token) {
 
    }

}

