const ShitcoinFactory = artifacts.require('./ShitcoinFactory.sol');
module.exports = function (deployer) {
  deployer.deploy(ShitcoinFactory);
};
