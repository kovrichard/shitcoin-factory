const ShitcoinFactory = artifacts.require("ShitcoinFactory");
const fs = require('fs');

module.exports = async (callback) => {
	let factory = await ShitcoinFactory.deployed();
	const abiJson = 'factory-abi.json';

	fs.writeFileSync(abiJson, JSON.stringify(factory.abi));
	console.log(ShitcoinFactory.address);

	callback();
}
