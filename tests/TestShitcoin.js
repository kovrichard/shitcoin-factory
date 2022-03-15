const Shitcoin = artifacts.require('Shitcoin');
const truffleAssert = require('truffle-assertions');
const ethereumWaffle = require('ethereum-waffle');
const chai = require('chai');
const { toInteger } = require('lodash');

chai.use(ethereumWaffle.solidity);
const expect = chai.expect;

const nullAddress = '0x0000000000000000000000000000000000000000';
const ether = 10 ** 18;

contract('Shitcoin constructor', (accounts) => {
  it('Creation should emit Transfer event', async () => {
    const coin = await Shitcoin.new('Test coin', 'TEST', 1, { from: accounts[0] });
    const txHash = coin.transactionHash;
    const result = await truffleAssert.createTransactionResult(coin, txHash);

    truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
      return (ev.from === nullAddress && ev.to === accounts[0] && toInteger(ev.value) === 1);
    }, 'Creation should emit Transfer event.');
  });
});

contract('Shitcoin', () => {
  const [wallet, walletTo, otherWallet] = new ethereumWaffle.MockProvider().getWallets();
  let token;

  beforeEach(async () => {
    token = await ethereumWaffle.deployContract(wallet, Shitcoin, ['Test coin', 'TEST', 1]);
  });

  it('Transfer should revert on sending to null address', async () => {
    await expect(token.transfer(nullAddress, 1)).to.be.revertedWith('BEP20: transfer to the zero address');
  });

  it('Transfer should revert on low balance', async () => {
    await expect(token.transfer(walletTo.address, BigInt(2 * ether))).to.be.revertedWith('BEP20: transfer amount exceeds balance');
  });

  it('Transfer should work', async () => {
    await expect(() => token.transfer(walletTo.address, 1))
      .to.changeTokenBalances(token, [wallet, walletTo], [-1, 1]);
  });

  it('Transfer should return true on success', async () => {
    const result = await token.callStatic.transfer(walletTo.address, 1);
    expect(result).to.equal(true);
  });

  it('Transfer should emit Transfer event', async () => {
    await expect(token.transfer(walletTo.address, 1))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, 1);
  });

  it('Approve should revert on approving to null address', async () => {
    await expect(token.approve(nullAddress, 5)).to.be.revertedWith('BEP20: approve to the zero address');
  });

  it('Approve should set allowance', async () => {
    await token.approve(walletTo.address, 5);
    expect(await token.allowance(wallet.address, walletTo.address)).to.equal(5);
  });

  it('Approve should return true on success', async () => {
    const result = await token.callStatic.approve(walletTo.address, 5);
    expect(result).to.equal(true);
  });

  it('Approve should emit Approval event', async () => {
    await expect(token.approve(walletTo.address, 5))
      .to.emit(token, 'Approval')
      .withArgs(wallet.address, walletTo.address, 5);
  });

  it('TransferFrom should revert on low allowance', async () => {
    await token.transfer(walletTo.address, 1);
    await expect(token.transferFrom(walletTo.address, otherWallet.address, 1)).to.be.revertedWith('BEP20: transfer amount exceeds allowance');
  });

  it('TransferFrom should work', async () => {
    const tokenFromOtherWallet = token.connect(walletTo);
    await token.transfer(walletTo.address, 1);
    await tokenFromOtherWallet.approve(wallet.address, 1);
    await expect(() => token.transferFrom(walletTo.address, otherWallet.address, 1))
      .to.changeTokenBalances(token, [walletTo, otherWallet], [-1, 1]);
  });

  it('TransferFrom should decrease allowance', async () => {
    const tokenFromOtherWallet = token.connect(walletTo);
    await token.transfer(walletTo.address, 1);
    await tokenFromOtherWallet.approve(wallet.address, 1);
    await token.transferFrom(walletTo.address, otherWallet.address, 1);
    expect(await token.allowance(wallet.address, walletTo.address)).to.equal(0);
  });

  it('TransferFrom should return true on success', async () => {
    const tokenFromOtherWallet = token.connect(walletTo);
    await token.transfer(walletTo.address, 1);
    await tokenFromOtherWallet.approve(wallet.address, 1);
    const result = await token.callStatic.transferFrom(walletTo.address, otherWallet.address, 1);
    expect(result).to.equal(true);
  });

  it('IncreaseAllowance should work', async () => {
    await token.approve(walletTo.address, 1);
    await token.increaseAllowance(walletTo.address, 4);
    expect(await token.allowance(wallet.address, walletTo.address)).to.equal(5);
  });

  it('IncreaseAllowance should return true on success', async () => {
    const result = await token.callStatic.increaseAllowance(walletTo.address, 4);
    expect(result).to.equal(true);
  });

  it('DecreaseAllowance should work', async () => {
    await token.approve(walletTo.address, 5);
    await token.decreaseAllowance(walletTo.address, 4);
    expect(await token.allowance(wallet.address, walletTo.address)).to.equal(1);
  });

  it('DecreaseAllowance should return true on success', async () => {
    await token.approve(walletTo.address, 5);
    const result = await token.callStatic.decreaseAllowance(walletTo.address, 4);
    expect(result).to.equal(true);
  });

  it('DecreaseAllowance should revert when deceasing below zero', async () => {
    await token.approve(walletTo.address, 1);
    await expect(token.decreaseAllowance(walletTo.address, 2)).to.be.revertedWith('BEP20: decreased allowance below zero');
  });

  it('Mint should not be allowed to be called by others', async () => {
    const tokenFromOtherWallet = token.connect(walletTo);
    await expect(tokenFromOtherWallet.mint(5)).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Mint should increase the total supply', async () => {
    await token.mint(5);
    expect(await token.totalSupply()).to.equal(6);
  });

  it('Mint should add the new tokens to the owner address', async () => {
    await token.mint(5);
    expect(await token.balanceOf(wallet.address)).to.equal(6);
  });

  it('Mint should return true on success', async () => {
    const result = await token.callStatic.mint(5);
    expect(result).to.equal(true);
  });

  it('Mint should emit Transfer event', async () => {
    await expect(token.mint(5))
      .to.emit(token, 'Transfer')
      .withArgs(nullAddress, wallet.address, 5);
  });

  it('Burn should revert when it exceeds balance', async () => {
    const tokenFromOtherWallet = token.connect(walletTo);
    await expect(tokenFromOtherWallet.burn(5)).to.be.revertedWith('BEP20: burn amount exceeds balance');
  });

  it('Burn should decrease total supply', async () => {
    await token.burn(1);
    expect(await token.totalSupply()).to.equal(0);
  });

  it('Burn should remove tokens from the caller address', async () => {
    await token.burn(1);
    expect(await token.balanceOf(wallet.address)).to.equal(0);
  });

  it('Burn should return true on success', async () => {
    const result = await token.callStatic.burn(1);
    expect(result).to.equal(true);
  });

  it('Burn should emit Transfer event', async () => {
    await expect(token.burn(1))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, nullAddress, 1);
  });
});
