const ShitcoinFactory = artifacts.require('ShitcoinFactory');
const ethereumWaffle = require('ethereum-waffle');
const chai = require('chai');

chai.use(ethereumWaffle.solidity);
const expect = chai.expect;

contract('ShitcoinFactory', () => {
  const [wallet] = new ethereumWaffle.MockProvider().getWallets();
  let factory;

  beforeEach(async () => {
    factory = await ethereumWaffle.deployContract(wallet, ShitcoinFactory);
  });

  it('NumberOfCoins should return number of coins', async () => {
    await factory.create('Test token', 'TTN', 5);
    expect(await factory.numberOfCoins()).to.equal(1);
    await factory.create('Test coin', 'TEST', 5);
    expect(await factory.numberOfCoins()).to.equal(2);
  });
});
