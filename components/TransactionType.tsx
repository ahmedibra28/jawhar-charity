export const TransactionType = (type: string) => {
  switch (type) {
    case 'DEPOSIT':
      return <span className='text-green-500'>{type}</span>
    case 'OPENING_BALANCE':
      return <span className='text-blue-500'>{type}</span>
    case 'EXPENSE':
      return <span className='text-red-500'>{type}</span>
    default:
      return <span className='text-yellow-500'>{type}</span>
  }
}
