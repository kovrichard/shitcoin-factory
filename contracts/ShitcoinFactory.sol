// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "./Shitcoin.sol";

contract ShitcoinFactory {
    Shitcoin[] private shitcoins;

    function create(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) public {
        Shitcoin shitcoin = new Shitcoin(name, symbol, totalSupply);
        shitcoin.transferOwnership(msg.sender);
        shitcoins.push(shitcoin);
    }

    function numberOfCoins() public view returns (uint256) {
        return shitcoins.length;
    }

    function getShitcoin(uint256 i) public view returns (Shitcoin) {
        return shitcoins[i];
    }
}
