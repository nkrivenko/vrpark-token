pragma solidity >=0.5.0;

import "./IExchangeInteractor.sol";


contract ExchangeInteractorStub is IExchangeInteractor {

    uint256 public usdEth;

    constructor (uint256 _usdEth) public {
        usdEth = _usdEth;
    }

    function updatePrice() public {
    }

    function getCurrentPrice() public view returns (uint256) {
        return usdEth;
    }
}

