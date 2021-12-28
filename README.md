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
