const ShitcoinFactory = artifacts.require("ShitcoinFactory");

module.exports = async (callback) => {
	let factory = await ShitcoinFactory.deployed();
	callback();
}
