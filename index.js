const fs = require('fs');
const ethers = require('ethers');
const abi = JSON.parse(fs.readFileSync('./build/contracts/ShitcoinFactory.json'));
const caddress = '0x0000000000000000000000000000000000000000';

provider = new ethers.providers.InfuraProvider('sepolia');
let wallet = new ethers.Wallet.fromMnemonic('');
let signer = wallet.connect(provider);
let contract = new ethers.Contract(caddress, abi.abi, signer);


module.exports = async (callback) => {
	console.log(await contract.costAddress());
	console.log(await contract.getCost());

	//await contract.setCostAddress('0x0000000000000000000000000000000000000000');
	//await contract.setCost(BigInt(10 * 10 ** 18));

	callback();
}
