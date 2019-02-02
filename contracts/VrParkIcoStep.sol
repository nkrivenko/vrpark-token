pragma solidity >=0.5.0;

import "./ThresholdWhitelistedCrowdsale.sol";
import "./IExchangeInteractor.sol";
import "./VrParkToken.sol";

import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/PausableCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract VrParkIcoStep is ThresholdWhitelistedCrowdsale, TimedCrowdsale, PausableCrowdsale, MintedCrowdsale, CappedCrowdsale {

    using SafeMath for uint256;

    uint256 public bonusMultiplier;
    uint256 public constant ONE_HUNDRED_PERCENT = 100;
    
    IExchangeInteractor public interactor;

    constructor (uint256 _openTime, uint256 _closeTime, uint256 _rate, uint256 _cap, 
		 uint256 _bonusMultiplier, uint256 _thresholdForWhitelist, address payable _wallet, 
		 VrParkToken _token, IExchangeInteractor _interactor) public
        ThresholdWhitelistedCrowdsale(_thresholdForWhitelist)
        CappedCrowdsale(_cap)
        TimedCrowdsale(_openTime, _closeTime)
        Crowdsale(_rate, _wallet, _token) {
        require(_bonusMultiplier > 0, "Bonus multiplier must be greater than zero");

        bonusMultiplier = _bonusMultiplier;
        interactor = _interactor;
    }

    function _getTokenAmount(uint256 weiAmount) internal view returns(uint256) {
        uint256 usdEth = interactor.getCurrentPrice();
        uint256 rate = rate();
        return usdEth.mul(weiAmount).mul(bonusMultiplier).div(ONE_HUNDRED_PERCENT).div(rate);
    }
}

