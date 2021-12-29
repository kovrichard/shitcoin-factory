const Shitcoin = artifacts.require('Shitcoin');
const truffleAssert = require('truffle-assertions');
const ethereumWaffle = require('ethereum-waffle');
const chai = require('chai');

chai.use(ethereumWaffle.solidity);

contract('Shitcoin', (accounts) => {
  const expect = chai.expect;
  const nullAddress = '0x0000000000000000000000000000000000000000';
  const [wallet, walletTo, otherWallet] = new ethereumWaffle.MockProvider().getWallets();
  let token;

  beforeEach(async () => {
    token = await ethereumWaffle.deployContract(wallet, Shitcoin, ['Test coin', 'TEST', 1]);
  });

  it('Creation should emit Transfer event', async () => {
    const coin = await Shitcoin.new('Test coin', 'TEST', 1, { from: accounts[0] });
    const txHash = coin.transactionHash;
    const result = await truffleAssert.createTransactionResult(coin, txHash);

    truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
      return (ev.from === nullAddress && ev.to === accounts[0] && ev.value == 1);
    }, 'Creation should emit Transfer event.');
  });

  it('Transfer should fail to null address', async () => {
    await expect(token.transfer(nullAddress, 1)).to.be.revertedWith('BEP20: transfer to the zero address');
  });

  it('Transfer should fail on low balance', async () => {
    await expect(token.transfer(accounts[0], 2)).to.be.revertedWith('BEP20: transfer amount exceeds balance');
  });

  it('Transfer should work', async () => {
    await expect(() => token.transfer(walletTo.address, 1))
      .to.changeTokenBalances(token, [wallet, walletTo], [-1, 1]);
  });

  it('Transfer should emit Transfer event', async () => {
    await expect(token.transfer(walletTo.address, 1))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, 1);
  });

  it('Approve should fail to null address', async () => {
    await expect(token.approve(nullAddress, 5)).to.be.revertedWith('BEP20: approve to the zero address');
  });

  it('Approve should set allowance', async () => {
    await token.approve(walletTo.address, 5);
    expect(await token.allowance(wallet.address, walletTo.address)).to.equal(5);
  });

  it('Approve should emit Approval event', async () => {
    await expect(token.approve(walletTo.address, 5))
      .to.emit(token, 'Approval')
      .withArgs(wallet.address, walletTo.address, 5);
  });

  it('TransferFrom should fail on low allowance', async () => {
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

  it('IncreaseAllowance should work', async () => {
    await token.approve(walletTo.address, 1);
    await token.increaseAllowance(walletTo.address, 4);
    expect(await token.allowance(wallet.address, walletTo.address)).to.equal(5);
  });

  it('DecreaseAllowance should work', async () => {
    await token.approve(walletTo.address, 5);
    await token.decreaseAllowance(walletTo.address, 4);
    expect(await token.allowance(wallet.address, walletTo.address)).to.equal(1);
  });
  
  it('DecreaseAllowance should fail when deceasing below zero', async () => {
    await token.approve(walletTo.address, 1);
    await expect(token.decreaseAllowance(walletTo.address, 2)).to.be.revertedWith('BEP20: decreased allowance below zero');
  });

});
