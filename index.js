const ShitcoinFactory = artifacts.require("./ShitcoinFactory.sol");

module.exports = async (callback) => {
	let factory = await ShitcoinFactory.deployed();
	callback();
}
