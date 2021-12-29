
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "../contracts/Shitcoin.sol";
import "../node_modules/truffle/build/Assert.sol";

contract TestShitcoin {
	function testCreationShouldSetName() public {
		Shitcoin coin = new Shitcoin("Test coin", "TEST", 1);
		Assert.equal(coin.name(), "Test coin", "Should set coin name");
	}

	function testCreationShouldSetSymbol() public {
		Shitcoin coin = new Shitcoin("Test coin", "TEST", 1);
		Assert.equal(coin.symbol(), "TEST", "Should set coin symbol");
	}

	function testCreationShouldSetTotalSupply() public {
		Shitcoin coin = new Shitcoin("Test coin", "TEST", 1000);
		Assert.equal(coin.totalSupply(), 1000, "Should set total supply");
	}

	function testCreationShouldSetDecimalsTo18() public {
		Shitcoin coin = new Shitcoin("Test coin", "TEST", 1000);
		Assert.equal(coin.decimals(), 18, "Should set decimals to 18");
	}

	function testCreationShouldSetOwnerToCaller() public {
		Shitcoin coin = new Shitcoin("Test coin", "TEST", 1000);
		Assert.equal(coin.owner(), address(this), "Should set owner to caller");
	}

	function testCreationShouldAddTotalSupplyToOwner() public {
		Shitcoin coin = new Shitcoin("Test coin", "TEST", 1000);
		Assert.equal(coin.balanceOf(address(this)), 1000, "Should add total supply to owner");
	}
}
