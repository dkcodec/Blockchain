const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('ModelMarketplace', function () {
  let ModelMarketplace, modelMarketplace, owner, addr1, addr2

  beforeEach(async function () {
    ModelMarketplace = await ethers.getContractFactory('ModelMarketplace')
    ;[owner, addr1, addr2] = await ethers.getSigners()
    modelMarketplace = await ModelMarketplace.deploy()
    await modelMarketplace.deployed()
  })

  it('Should list a new model', async function () {
    await modelMarketplace
      .connect(addr1)
      .listModel('TestModel', 'Test Description', ethers.utils.parseEther('1'))
    const listedModel = await modelMarketplace.models(1)

    expect(listedModel.name).to.equal('TestModel')
    expect(listedModel.description).to.equal('Test Description')
    expect(listedModel.price).to.equal(ethers.utils.parseEther('1'))
    expect(listedModel.creator).to.equal(addr1.address)
  })

  it('Should purchase a model', async function () {
    await modelMarketplace
      .connect(addr1)
      .listModel('PaidModel', 'Description', ethers.utils.parseEther('1'))

    await expect(
      modelMarketplace
        .connect(addr2)
        .purchaseModel(1, { value: ethers.utils.parseEther('1') })
    )
      .to.emit(modelMarketplace, 'ModelPurchased')
      .withArgs(1, addr2.address)

    // Проверка, что создатель получил 0.99 ETH (при 1% комиссии)
    // Для этого можно проверить баланс создателя до и после покупки
    const initialCreatorBalance = await ethers.provider.getBalance(
      addr1.address
    )

    const tx = await modelMarketplace
      .connect(addr2)
      .purchaseModel(1, { value: ethers.utils.parseEther('1') })
    const receipt = await tx.wait()

    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
    const finalCreatorBalance = await ethers.provider.getBalance(addr1.address)

    expect(finalCreatorBalance.sub(initialCreatorBalance)).to.equal(
      ethers.utils.parseEther('0.99')
    )
  })

  it('Should fail to purchase with incorrect amount', async function () {
    await modelMarketplace
      .connect(addr1)
      .listModel('ModelX', 'Description', ethers.utils.parseEther('1'))
    await expect(
      modelMarketplace
        .connect(addr2)
        .purchaseModel(1, { value: ethers.utils.parseEther('0.5') })
    ).to.be.revertedWith('Incorrect payment amount')
  })

  it('Should let users rate a model', async function () {
    await modelMarketplace
      .connect(addr1)
      .listModel('RateMe', 'Test desc', ethers.utils.parseEther('1'))
    await modelMarketplace
      .connect(addr2)
      .purchaseModel(1, { value: ethers.utils.parseEther('1') })

    await expect(modelMarketplace.connect(addr2).rateModel(1, 5))
      .to.emit(modelMarketplace, 'ModelRated')
      .withArgs(1, 5, addr2.address)

    const details = await modelMarketplace.getModelDetails(1)
    const avgRating = details.avgRating.toString() // Используем доступ по имени
    expect(avgRating).to.equal('5')
  })

  it('Should withdraw funds by owner only', async function () {
    // Листим модель и покупаем её, чтобы собрать комиссию
    await modelMarketplace
      .connect(addr1)
      .listModel(
        'CommissionModel',
        'Commission Description',
        ethers.utils.parseEther('1')
      )
    await modelMarketplace
      .connect(addr2)
      .purchaseModel(1, { value: ethers.utils.parseEther('1') })

    // Проверяем баланс контракта (должен быть 0.01 ETH при 1% комиссии)
    const contractBalance = await ethers.provider.getBalance(
      modelMarketplace.address
    )
    expect(ethers.utils.formatEther(contractBalance)).to.equal('0.01')

    // Попытка вывода средств не владельцем должна провалиться
    await expect(
      modelMarketplace.connect(addr1).withdrawFunds()
    ).to.be.revertedWith('Only owner can withdraw')

    // Сохраняем баланс владельца до вывода
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address)

    // Владелец выводит средства
    const tx = await modelMarketplace.connect(owner).withdrawFunds()
    const receipt = await tx.wait()

    // Получаем сумму газа
    const gasUsed = receipt.gasUsed
    const effectiveGasPrice = receipt.effectiveGasPrice
    const gasCost = gasUsed.mul(effectiveGasPrice)

    // Проверяем баланс владельца после вывода
    const finalOwnerBalance = await ethers.provider.getBalance(owner.address)
    expect(finalOwnerBalance.sub(initialOwnerBalance).add(gasCost)).to.equal(
      ethers.utils.parseEther('0.01')
    )
  })
})
