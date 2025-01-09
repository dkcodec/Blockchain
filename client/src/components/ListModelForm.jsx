import React, { useState } from 'react'
import { ethers } from 'ethers'

function ListModelForm({ contract }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priceEth, setPriceEth] = useState('0.01')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contract) return alert('Контракт недоступен!')

    try {
      const priceWei = ethers.utils.parseEther(priceEth)
      const tx = await contract.listModel(name, description, priceWei)
      await tx.wait()
      alert('Модель успешно размещена!')
      setName('')
      setDescription('')
      setPriceEth('0.01')
    } catch (error) {
      console.error(error)
      alert('Ошибка при листинге модели')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Список новой модели</h3>
      <div>
        <label>Название: </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Описание: </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Цена (ETH): </label>
        <input
          value={priceEth}
          onChange={(e) => setPriceEth(e.target.value)}
          required
        />
      </div>
      <button type='submit'>Добавить</button>
    </form>
  )
}

export default ListModelForm
