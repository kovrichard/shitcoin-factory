module.exports = async (callback) => {
    const addresses = await web3.eth.getAccounts();
    console.log(addresses);
    callback();
};
