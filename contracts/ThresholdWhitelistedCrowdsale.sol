pragma solidity >=0.5.0;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";


/**
 * @title ThresholdWhitelistedCrowdsale
 * @dev Crowdsale in which only whitelisted users can invest more than a threshold
 */
contract ThresholdWhitelistedCrowdsale is WhitelistedRole, Crowdsale {

    uint256 public threshold;

    constructor (uint256 _threshold) public {
        threshold = _threshold;
    }

    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal view {
        if (_weiAmount >= threshold) {
            require(isWhitelisted(_beneficiary), "Investors with large sums must be whitelisted");
	}
        super._preValidatePurchase(_beneficiary, _weiAmount);
    }

}

