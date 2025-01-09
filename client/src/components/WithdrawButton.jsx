import React from 'react'

function WithdrawButton({ contract }) {
  const handleWithdraw = async () => {
    if (!contract) return alert('Контракт недоступен!')

    try {
      const tx = await contract.withdrawFunds()
      await tx.wait()
      alert('Средства выведены успешно!')
    } catch (error) {
      console.error(error)
      alert('Ошибка при выводе средств (доступно только владельцу)')
    }
  }

  return <button onClick={handleWithdraw}>Вывести средства (Owner)</button>
}

export default WithdrawButton
