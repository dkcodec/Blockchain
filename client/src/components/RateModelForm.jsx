import React, { useState } from 'react'

function RateModelForm({ contract, modelId }) {
  const [rating, setRating] = useState(5)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contract) return alert('Контракт недоступен!')

    try {
      const tx = await contract.rateModel(modelId, rating)
      await tx.wait()
      alert(`Вы поставили рейтинг ${rating} модели #${modelId}`)
    } catch (error) {
      console.error(error)
      alert('Ошибка при оценке модели')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Оценка (1-5): </label>
      <input
        type='number'
        min='1'
        max='5'
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <button type='submit'>Оценить</button>
    </form>
  )
}

export default RateModelForm
