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
});
