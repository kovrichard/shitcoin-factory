const ShitcoinFactory = artifacts.require('ShitcoinFactory');
const Shitcoin = artifacts.require('Shitcoin');
const ethereumWaffle = require('ethereum-waffle');
const ethers = require('ethers');
const chai = require('chai');

chai.use(ethereumWaffle.solidity);
const expect = chai.expect;
const ether = 10 ** 18;

contract('ShitcoinFactory', () => {
  const [wallet] = new ethereumWaffle.MockProvider().getWallets();
  let factory;

  beforeEach(async () => {
    factory = await ethereumWaffle.deployContract(wallet, ShitcoinFactory);
  });

  it('Create should create shitcoin', async () => {
    await factory.create('Test token', 'TTN', 5);
    const token = await factory.getShitcoin(0);
    const contract = new ethers.Contract(token, Shitcoin.abi, wallet);

    expect(await contract.callStatic.name()).to.equal('Test token');
    expect(await contract.callStatic.symbol()).to.equal('TTN');
    expect(await contract.callStatic.totalSupply()).to.equal(BigInt(5 * ether));
  });

  it('Create should transfer ownership to caller', async () => {
    await factory.create('Test token', 'TTN', 5, { from: wallet.address });
    const token = await factory.getShitcoin(0);
    const contract = new ethers.Contract(token, Shitcoin.abi, wallet);

    expect(await contract.callStatic.getOwner()).to.equal(wallet.address);
  });

  it('Create should transfer coins to caller', async () => {
    await factory.create('Test token', 'TTN', 5, { from: wallet.address });
    const token = await factory.getShitcoin(0);
    const contract = new ethers.Contract(token, Shitcoin.abi, wallet);

    expect(await contract.callStatic.balanceOf(wallet.address)).to.equal(BigInt(5 * ether));
  });

  it('NumberOfCoins should return number of coins', async () => {
    await factory.create('Test token', 'TTN', 5);
    expect(await factory.numberOfCoins()).to.equal(1);
    await factory.create('Test coin', 'TEST', 5);
    expect(await factory.numberOfCoins()).to.equal(2);
  });

  it('GetShitcoin returns coin', async () => {
    await factory.create('Token 1', 'TN1', 5);
    await factory.create('Token 2', 'TN2', 7);

    const token1 = await factory.getShitcoin(0);
    const token2 = await factory.getShitcoin(1);
    const contract1 = new ethers.Contract(token1, Shitcoin.abi, wallet);
    const contract2 = new ethers.Contract(token2, Shitcoin.abi, wallet);

    expect(await contract1.callStatic.symbol()).to.equal('TN1');
    expect(await contract2.callStatic.symbol()).to.equal('TN2');
  });
});
