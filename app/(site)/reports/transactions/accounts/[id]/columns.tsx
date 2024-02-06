import { FormatNumber } from '@/components/FormatNumber'
import { TransactionType } from '@/components/TransactionType'
import DateTime from '@/lib/dateTime'

export const columns = () => {
  return [
    { header: 'Account', accessorKey: 'account.name', active: true },
    {
      header: 'Amount',
      accessorKey: 'amount',
      active: true,
      cell: ({ row: { original } }: any) => (
        <FormatNumber value={original?.amount} />
      ),
    },
    {
      header: 'Type',
      accessorKey: 'type',
      active: true,
      cell: ({ row: { original } }: any) => TransactionType(original?.type),
    },
    {
      header: 'Donar/Created',
      accessorKey: 'donar.name',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.donor?.name || original?.createdBy?.name,
    },
    {
      header: 'CreatedAt',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) =>
        DateTime(original?.createdAt).format('DD-MM-YYYY'),
    },
  ]
}
