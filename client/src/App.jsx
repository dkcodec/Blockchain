import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import modelMarketplaceABI from './abis/ModelMarketplace.json'

import ListModelForm from './components/ListModelForm'
import PurchaseModelButton from './components/PurchaseModelButton'
import RateModelForm from './components/RateModelForm'
import WithdrawButton from './components/WithdrawButton'

function App() {
  const [contract, setContract] = useState(null)
  const [models, setModels] = useState([])
  const [modelCount, setModelCount] = useState(0)
  const [selectedModelId, setSelectedModelId] = useState(1)
  const [details, setDetails] = useState(null)
  const [feePercentage, setFeePercentage] = useState(0)

  const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

  useEffect(() => {
    initContract()
  }, [])

  async function initContract() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(
          contractAddress,
          modelMarketplaceABI.abi,
          signer
        )
        setContract(contractInstance)

        // Получим количество моделей
        const count = await contractInstance.modelCount()
        setModelCount(count.toNumber())

        // Получим процент комиссии
        const fee = await contractInstance.feePercentage()
        setFeePercentage(fee.toNumber())

        // Загрузим все модели
        const loadedModels = []
        for (let i = 1; i <= count; i++) {
          const model = await contractInstance.getModelDetails(i)
          loadedModels.push({
            id: i,
            name: model.name,
            description: model.description,
            price: ethers.utils.formatEther(model.price),
            creator: model.creator,
            avgRating: model.avgRating.toString(),
          })
        }
        setModels(loadedModels)
      } catch (err) {
        console.error('Ошибка при инициализации контракта:', err)
      }
    } else {
      alert('Установите MetaMask!')
    }
  }

  // Запрос информации о модели
  async function fetchModelDetails() {
    if (!contract) return
    try {
      const result = await contract.getModelDetails(selectedModelId)
      // result - это [name, description, price, creator, avgRating]
      setDetails({
        name: result.name,
        description: result.description,
        price: ethers.utils.formatEther(result.price),
        creator: result.creator,
        avgRating: result.avgRating.toString(),
      })
    } catch (error) {
      console.error(error)
      alert('Невозможно получить детали модели')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Model Marketplace</h1>

      {contract ? (
        <>
          {/* Форма для листинга модели */}
          <ListModelForm contract={contract} />

          {/* Блок для получения деталей модели по ID */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Получить детали модели</h3>
            <label>ID модели: </label>
            <input
              type='number'
              min='1'
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(Number(e.target.value))}
            />
            <button onClick={fetchModelDetails}>Показать детали</button>
            {details && (
              <div style={{ marginTop: '10px' }}>
                <p>
                  <b>Название:</b> {details.name}
                </p>
                <p>
                  <b>Описание:</b> {details.description}
                </p>
                <p>
                  <b>Цена (ETH):</b> {details.price}
                </p>
                <p>
                  <b>Создатель:</b> {details.creator}
                </p>
                <p>
                  <b>Средний рейтинг:</b> {details.avgRating}
                </p>
              </div>
            )}
          </div>

          {/* Кнопка покупки */}
          {details && (
            <PurchaseModelButton
              contract={contract}
              modelId={selectedModelId}
              price={details.price}
            />
          )}

          {/* Форма для оценки модели */}
          {details && (
            <RateModelForm contract={contract} modelId={selectedModelId} />
          )}

          {/* Кнопка для вывода средств (только Owner) */}
          <WithdrawButton contract={contract} />
        </>
      ) : (
        <p>Подключение к контракту...</p>
      )}
    </div>
  )
}

export default App
