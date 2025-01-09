const hre = require('hardhat')

async function main() {
  const ModelMarketplace = await hre.ethers.getContractFactory(
    'ModelMarketplace'
  )
  const modelMarketplace = await ModelMarketplace.deploy()

  await modelMarketplace.deployed()
  console.log('ModelMarketplace deployed to:', modelMarketplace.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
