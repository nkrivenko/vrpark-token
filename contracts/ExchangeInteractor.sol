pragma solidity >=0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./IExchangeInteractor.sol";
import "./oraclizeAPI.sol";


/**
 * @title Exchange interactor for Monoreto ICO.
 * 
 */
contract ExchangeInteractor is usingOraclize, IExchangeInteractor, Ownable {

    using SafeMath for uint256;

    // 4 hours
    uint256 public constant QUERY_TIME_PERIOD = 14400;

    uint256 public usdEthRate;
    string public jsonPath = "json(json(https://api.kraken.com/0/public/Ticker?pair=ETHUSD).result.XETHZUSD.c.0)";

    event NewUsdEthRate(uint256 rate);
    event NewQuery(string comment);
    event EthReceived(uint256 eth);

    constructor (uint256 _initialUsdEthRate) public {
        require(_initialUsdEthRate > 0, "Initial USDETH rate must be greater than zero!");

        usdEthRate = _initialUsdEthRate;

        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        updatePrice();
    }

    /**
     * @dev when using oraclize, ETH are withdrawed from contract address
     * so it should be able to receive ETH.
     */
    function () external payable {
        emit EthReceived(msg.value);
    }

    function setJsonPath(string calldata _jsonPath) external onlyOwner {
        jsonPath = _jsonPath;
    }

    function __callback(bytes32 myid, string memory result, bytes memory proof) public {
        require(msg.sender == oraclize_cbAddress(), "Invoked not by oraclize address!");
        usdEthRate = parseInt(result, 5).div(100000);
        emit NewUsdEthRate(usdEthRate);
        updatePrice();
    }

    function updatePrice() public onlyOwner {
        if (oraclize.getPrice("URL") > address(this).balance) {
            emit NewQuery("Insufficient funds");
        } else {
            oraclize_query(QUERY_TIME_PERIOD, "URL", jsonPath);
        }
    }

    function getCurrentPrice() public view returns (uint256) {
        return usdEthRate;
    }

    function close() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

}

