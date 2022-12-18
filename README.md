# All I Want For Christmas is ETH

The [ChristmasPresent](./contracts/ChristmasPresent.sol) contract is used to time-lock some [EVM](https://ethereum.org/en/developers/docs/evm/) native tokens that can only be withdrawn by the contract owner after Christmas.

You can use this contract to introduce a lazy friend to the EVM ecosystem in a funny and motivational way!

If you want to reuse this, quite simple:

1. Change the hard-coded `unlockTime` in the contract
2. Deploy the contract with a reasonable amount of native tokens (those are your present)
3. Give the seed phrase of the contract to your friend along with some hints of what to do with this.

## Common commands

```shell
npx hardhat help
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## Credits

This project is strongly inspired of [Hardhat](https://hardhat.org/)'s [TypeScript sample project](https://github.com/NomicFoundation/hardhat/tree/main/packages/hardhat-core/sample-projects/typescript).
