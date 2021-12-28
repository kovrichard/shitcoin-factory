// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "./Shitcoin.sol";

contract ShitcoinFactory {
    function create(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) public returns (address) {
        Shitcoin shitcoin = new Shitcoin(name, symbol, totalSupply);

        return shitcoin.owner();
    }
}
