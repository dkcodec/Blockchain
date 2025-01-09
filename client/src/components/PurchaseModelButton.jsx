import React from 'react'
import { ethers } from 'ethers'

function PurchaseModelButton({ contract, modelId, price }) {
  const handlePurchase = async () => {
    if (!contract) return alert('Контракт недоступен!')

    try {
      const tx = await contract.purchaseModel(modelId, {
        value: ethers.utils.parseEther(price),
      })
      await tx.wait()
      alert(`Модель #${modelId} куплена за ${price} ETH`)
    } catch (error) {
      console.error(error)
      alert('Ошибка при покупке модели')
    }
  }

  return (
    <button onClick={handlePurchase}>
      Купить модель #{modelId} за {price} ETH
    </button>
  )
}

export default PurchaseModelButton
