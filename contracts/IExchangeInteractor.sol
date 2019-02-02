pragma solidity >=0.5.0;


interface IExchangeInteractor {
    function updatePrice() external;

    function getCurrentPrice() external view returns (uint256);

    event PriceUpdated(uint256 newPrice);
}

