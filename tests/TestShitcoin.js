const Shitcoin = artifacts.require('Shitcoin');
const truffleAssert = require('truffle-assertions');

contract('Shitcoin', (accounts) => {
  const nullAddress = '0x0000000000000000000000000000000000000000';

  it('Creation should emit Transfer event', async () => {
    const coin = await Shitcoin.new('Test coin', 'TEST', 1, { from: accounts[0] });
    const txHash = coin.transactionHash;
    const result = await truffleAssert.createTransactionResult(coin, txHash);

    truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
      return (ev.from === nullAddress && ev.to === accounts[0] && ev.value == 1);
    }, 'Creation should emit Transfer event.');
  });

  it('Transfer should fail to null address', async () => {
	  const coin = await Shitcoin.new('Test coin', 'TEST', 1);

    await truffleAssert.reverts(coin.transfer(nullAddress, 1), 'BEP20: transfer to the zero address');
  });

  it('Transfer should fail on low balance', async () => {
	  const coin = await Shitcoin.new('Test coin', 'TEST', 1);

    await truffleAssert.reverts(coin.transfer(accounts[0], 2), 'BEP20: transfer amount exceeds balance');
  });

});

