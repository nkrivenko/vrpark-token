# VR Park ICO

## Technologies used
1. Ethereum blockchain as a base of infrastructure
2. solc 0.5.0
3. Truffle 5.0.1 for testing
4. OpenZeppelin v2.1.1 contracts as a base of source code

## Project summary

The project consists of ERC20 app token, crowdsale step smart contract and oracle.

`contracts/VrParkToken.sol` contans VR token smart contract. VR is a capped mintable token.

`contracts/VrParkIcoStep.sol` is a ICO step smart contract. It has the following features:
- Any investor wishing to pay more than `thresholdForWhitelist` must be in a whitelist
- ETHVR rate is defined as `ETHUSD / USDVR`
- `ETHUSD` is taken from oracle

`contracts/ExchangeInteractor.sol` retrieves the quotes from given exchange. It uses oraclize API widely.

## How to use

In order to use an instance of `VrParkIcoStep`, the following steps have to be taken:
1. Create a `VrParkToken` instance.
2. Create an `ExchangeInteractor` instance.
3. Create a `VrParkIcoStep` instance using previously created token and oracle instances as corresponding parameters.
4. Add address of `VrParkIcoStep` instance as a minter using token's `addMinter` function.

