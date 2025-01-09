require('@nomiclabs/hardhat-ethers')
require('@nomicfoundation/hardhat-chai-matchers')
// Удалён require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: '0.8.18',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      // chainId: 31337, // по умолчанию Hardhat
    },
    // Пример для других сетей:
    // goerli: {
    //   url: "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    //   accounts: [`0x${PRIVATE_KEY}`]
    // }
  },
}
