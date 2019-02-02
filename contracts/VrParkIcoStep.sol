pragma solidity 0.5.0;

import "./VrParkToken.sol";

import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract VrParkIcoStep is TimedCrowdsale, MintedCrowdsale, CappedCrowdsale {

    constructor (uint256 openTime, uint256 closeTime, uint256 rate, uint256 cap, address payable wallet, VrParkToken token) public
        CappedCrowdsale(cap)
        TimedCrowdsale(openTime, closeTime)
        Crowdsale(rate, wallet, token) {
 
    }

}

