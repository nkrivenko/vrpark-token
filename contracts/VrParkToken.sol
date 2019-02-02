pragma solidity >=0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";


contract VrParkToken is ERC20Mintable, ERC20Capped, ERC20Detailed, Ownable {

    uint8 internal constant DECIMALS = 18;

    constructor (uint256 _cap) public ERC20Detailed("VR", "VR", DECIMALS)
        ERC20Capped(_cap) {
        // empty block
    }

    function removeMinter(address account) public onlyOwner {
        _removeMinter(account);
    }

}

