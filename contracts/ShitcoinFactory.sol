// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "./Shitcoin.sol";
import "./Ownable.sol";
import "./IBEP20.sol";

contract ShitcoinFactory is Ownable {
    Shitcoin[] private shitcoins;
    address private _costAddress;
    uint256 private _cost;

    constructor(address costAddr, uint256 cost) {
        _costAddress = costAddr;
        _cost = cost;
    }

    function create(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) public {
        if (_costAddress != address(0x0000000000000000000000000000000000000000)) {
            IBEP20 costContract = IBEP20(address(_costAddress));
            uint256 balance = costContract.balanceOf(msg.sender);
            require(_cost <= balance, "Cost balance is low");
            costContract.transferFrom(msg.sender, owner(), _cost);
        }

        Shitcoin shitcoin = new Shitcoin(name, symbol, totalSupply * (10**18));
        shitcoin.transferOwnership(msg.sender);
        shitcoin.transfer(msg.sender, shitcoin.totalSupply());
        shitcoins.push(shitcoin);
    }

    function numberOfCoins() public view returns (uint256) {
        return shitcoins.length;
    }

    function getShitcoin(uint256 i) public view returns (Shitcoin) {
        return shitcoins[i];
    }

    function setCostAddress(address addr) public onlyOwner returns (bool) {
        _costAddress = addr;
        return true;
    }

    function costAddress() public view returns (address) {
        return _costAddress;
    }

    function setCost(uint256 cost) public onlyOwner returns (bool) {
        _cost = cost;
        return true;
    }

    function getCost() public view returns (uint256) {
        return _cost;
    }
}
