import { FormatNumber } from '@/components/FormatNumber'
import { ActionButton } from '@/components/ui/CustomForm'
import DateTime from '@/lib/dateTime'
import Link from 'next/link'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  deleteHandler: (item: any) => void
}

export const columns = ({ editHandler, isPending, deleteHandler }: Column) => {
  return [
    { header: 'Name', accessorKey: 'name', active: true },
    { header: 'Sex', accessorKey: 'sex', active: true },
    { header: 'Country', accessorKey: 'country', active: true },
    { header: 'Mobile', accessorKey: 'mobile', active: true },
    {
      header: 'Balance',
      accessorKey: 'balance',
      active: true,
      cell: ({ row: { original } }: any) => (
        <Link
          className='underline'
          href={`/reports/transactions/donors/${original?.id}`}
        >
          <FormatNumber value={original?.balance} />
        </Link>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      active: true,
      cell: ({ row: { original } }: any) =>
        original?.status === 'ACTIVE' ? (
          <span className='text-green-500'>{original?.status}</span>
        ) : (
          <span className='text-red-500'>{original?.status}</span>
        ),
    },
    {
      header: 'CreatedAt',
      accessorKey: 'createdAt',
      active: true,
      cell: ({ row: { original } }: any) =>
        DateTime(original?.createdAt).format('DD-MM-YYYY'),
    },
    {
      header: 'Action',
      active: true,
      cell: ({ row: { original } }: any) => (
        <ActionButton
          editHandler={editHandler}
          isPending={isPending}
          deleteHandler={deleteHandler}
          original={original}
        />
      ),
    },
  ]
}
