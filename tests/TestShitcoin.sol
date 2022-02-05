
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "../contracts/Shitcoin.sol";
import "../node_modules/truffle/build/Assert.sol";

contract TestShitcoin {
	function createCoin(string memory name, string memory symbol, uint256 totalSupply) internal returns (Shitcoin) {
		return new Shitcoin(name, symbol, totalSupply);
	}

	function createCoin(uint256 totalSupply) internal returns(Shitcoin) {
		return createCoin("Test coin", "TEST", totalSupply);
	}

	function createCoin() internal returns (Shitcoin) {
		return createCoin("Test coin", "TEST", 1);
	}

	function testCreationShouldSetName() public {
		Shitcoin coin = createCoin();
		Assert.equal(coin.name(), "Test coin", "Should set coin name");
	}

	function testCreationShouldSetSymbol() public {
		Shitcoin coin = createCoin();
		Assert.equal(coin.symbol(), "TEST", "Should set coin symbol");
	}

	function testCreationShouldSetTotalSupply() public {
		Shitcoin coin = createCoin(1000);
		Assert.equal(coin.totalSupply(), 1000 * (10 ** 18), "Should set total supply");
	}

	function testCreationShouldSetDecimalsTo18() public {
		Shitcoin coin = createCoin();
		Assert.equal(coin.decimals(), 18, "Should set decimals to 18");
	}

	function testCreationShouldSetOwnerToCaller() public {
		Shitcoin coin = createCoin();
		Assert.equal(coin.owner(), address(this), "Should set owner to caller");
	}

	function testCreationShouldAddTotalSupplyToOwner() public {
		Shitcoin coin = createCoin(1000);
		Assert.equal(coin.balanceOf(address(this)), 1000 * (10 ** 18), "Should add total supply to owner");
	}
}
