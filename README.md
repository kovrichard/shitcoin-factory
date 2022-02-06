# shitcoin-factory

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

## Environment

The development environment is inside the container. Edit the files outside, then build and deploy them with the help of the `Makefile`.
Testing is also possible with it.

Build the container first then start it:

```
make build
make start
```

## Useful commands

On Windows, use [nmake](https://docs.microsoft.com/en-us/cpp/build/reference/nmake-reference?view=msvc-160&viewFallbackFrom=vs-2019) instead of `make`.

Check out the `Makefile` for the most used commands.

### Deploying the contract

Compile first, then deploy to the local blockchain:

```
make compile
make deploy
```

### Testing the contract

```
make test
```

### Get addresses from the Truffle console:

```
let addresses = await web3.eth.getAccounts()
```

or use the command `make addresses`

## Files

### keys.json

It contains the private keys of the test addresses that ganache generated

### factory-abi.json

It contains the ABI of the Shitcoin Factory. Use it with `web3` or `ethers`, when you want to access the contract's functions.

## Connecting to the local blockchain with Metamask

Add a network to Metamask:
- Network name: Local blockchain
- New RPC URL: http://127.0.0.1:8545
    + If it says that another network already uses this ID, simply delete the network
    + The colliding network will probably be the predefined Localhost 8545, which you will just create yourself
- Chain ID: 1337 (could be different for you)
- Currency Symbol: ETH
- Block Explorer URL: leave blank

Import one of the addresses generated by ganache
- It Metamask, click your profile picture
- Click `Import Account`
- Paste the corresponding private key from `keys.json`
