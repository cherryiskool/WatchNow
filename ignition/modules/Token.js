// code used from https://hardhat.org/tutorial/deploying-to-a-live-network
// allows hardhat ignition to deploy the contract, had to use this as other method did not work

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("TokenModule", (m) => {
  const token = m.contract("Token");

  return { token };
});

module.exports = TokenModule;