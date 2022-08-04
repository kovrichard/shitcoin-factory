const ShitcoinFactory = artifacts.require("ShitcoinFactory");
const fs = require('fs');

module.exports = async (callback) => {
	let factory = await ShitcoinFactory.deployed();

	await factory.setCostAddress('0x0000000000000000000000000000000000000000');
	await factory.setCost(BigInt(10 * 10 ** 18));
	console.log(await factory.costAddress());
	console.log(await factory.getCost());

	callback();
}
