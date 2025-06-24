// require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
// require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-toolbox");


require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const endpoint = process.env.URL;
const etherscanKey = process.env.ETHERSCAN_KEY;

module.exports = {
  solidity: {
    version: "0.8.0"
  },
  networks: {
    sepolia : {
      url: endpoint,
      accounts : [`0x${privateKey}`]
    }
  },
	etherscan: {
		apiKey: etherscanKey
	}
};
