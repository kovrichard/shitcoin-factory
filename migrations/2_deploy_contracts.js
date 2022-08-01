const ShitcoinFactory = artifacts.require('./ShitcoinFactory.sol');
const ether = 10 ** 18;

module.exports = function (deployer) {
  deployer.deploy(ShitcoinFactory, '0x0000000000000000000000000000000000000000', BigInt(10 * ether));
};
