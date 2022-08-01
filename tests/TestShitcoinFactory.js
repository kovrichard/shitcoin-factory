const ShitcoinFactory = artifacts.require('ShitcoinFactory');
const Shitcoin = artifacts.require('Shitcoin');
const ethereumWaffle = require('ethereum-waffle');
const ethers = require('ethers');
const chai = require('chai');

chai.use(ethereumWaffle.solidity);
const expect = chai.expect;
const ether = 10 ** 18;
const nullAddress = '0x0000000000000000000000000000000000000000';
const cost = 10 * ether;

contract('ShitcoinFactory', () => {
  const [wallet, otherWallet] = new ethereumWaffle.MockProvider().getWallets();
  let factory;

  beforeEach(async () => {
    factory = await ethereumWaffle.deployContract(wallet, ShitcoinFactory, [nullAddress, BigInt(cost)]);
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

  it('Create should transfer cost coins to owner', async () => {
    const otherFactory = factory.connect(otherWallet);
    await otherFactory.create('Cost token', 'COST', 1000);
    const token = await otherFactory.getShitcoin(0);
    const f = factory.connect(wallet);
    await f.setCostAddress(token);
    
    const contract = new ethers.Contract(token, Shitcoin.abi, otherWallet);
    await contract.approve(factory.address, BigInt(10 * ether));
    await otherFactory.create('New token', 'NEW', 1000);

    expect(await contract.balanceOf(otherWallet.address)).to.equal(BigInt(990*ether));
    expect(await contract.balanceOf(wallet.address)).to.equal(BigInt(10*ether));
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

  it('SetCostAddress should set cost address', async () => {
    await factory.setCostAddress('0x0000000000000000000000000000000000000123');

    expect(await factory.costAddress()).to.equal('0x0000000000000000000000000000000000000123');
  });

  it('SetCost should set cost', async () => {
    await factory.setCost(10);

    expect(await factory.getCost()).to.equal(10);
  });
});
