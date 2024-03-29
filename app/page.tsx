'use client'

import getAccounts from '@/actions/getAccounts'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { FormButton } from '@/components/ui/CustomForm'
import { FormatNumber } from '@/components/FormatNumber'
import getLastTenDepositTransactions from '@/actions/getLastTenDepositTransactions'
import getLastTenExpenseTransactions from '@/actions/getLastTenExpenseTransactions'
import getLastTenHighestBalanceDonors from '@/actions/getLastTenHighestBalanceDonors'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import DateTime from '@/lib/dateTime'
import { Button } from '@/components/ui/button'
import { FaCog } from 'react-icons/fa'
import generateExpenses from '@/actions/generateExpenses'
import useUserInfoStore from '@/zustand/userStore'

interface AccountProp {
  name: string
  balance: number
  description: string
}

interface LastTenDepositTransactionProp {
  donor: {
    name: string
  }
  amount: number
  description: string
  account: {
    name: string
  }
}
interface LastTenExpenseTransactionProp {
  amount: number
  description: string
  account: {
    name: string
  }
  createdBy: {
    name: string
  }
}

interface LastTenHighestBalanceDonorsProp {
  balance: number
  mobile: string
  name: string
}

export default function Home() {
  const [accounts, setAccounts] = React.useState<AccountProp[]>([])
  const [lastTenDepositTransactions, setLastTenDepositTransactions] =
    React.useState<LastTenDepositTransactionProp[]>([])
  const [lastTenExpenseTransactions, setLastTenExpenseTransactions] =
    React.useState<LastTenExpenseTransactionProp[]>([])
  const [lastTenHighestBalanceDonors, setLastTenHighestBalanceDonors] =
    React.useState<LastTenHighestBalanceDonorsProp[]>([])

  const [isPending, startTransition] = React.useTransition()

  const path = useAuthorization()
  const router = useRouter()

  React.useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  React.useEffect(() => {
    startTransition(() => {
      getAccounts().then((res) => {
        setAccounts((res as AccountProp[]) || [])
      })
    })

    startTransition(() => {
      getLastTenDepositTransactions().then((res) => {
        setLastTenDepositTransactions(
          (res as LastTenDepositTransactionProp[]) || []
        )
      })
    })

    startTransition(() => {
      getLastTenExpenseTransactions().then((res) => {
        setLastTenExpenseTransactions(
          (res as LastTenExpenseTransactionProp[]) || []
        )
      })
    })

    startTransition(() => {
      getLastTenHighestBalanceDonors().then((res) => {
        setLastTenHighestBalanceDonors(
          (res as LastTenHighestBalanceDonorsProp[]) || []
        )
      })
    })

    // eslint-disable-next-line
  }, [])

  const { userInfo } = useUserInfoStore((state) => state)

  const generateExpense = () => {
    startTransition(() => {
      generateExpenses({ payee: userInfo.id }).then((res) => res)
      window.location.reload()
    })
  }

  return (
    <div className='p-2'>
      <TopLoadingBar isFetching={isPending} />

      <Card className='mb-4'>
        <CardHeader>
          <CardTitle>Generate Expense</CardTitle>
          <CardDescription>
            Generate{' '}
            <span className='font-bold'>
              {DateTime(new Date()).format('MMM YYYY')}
            </span>{' '}
            expense
            <br />
            <span className='font-bold'>Note: </span>
            <span>Your name will be used as the payee name</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateExpense} className='gap-x-2'>
            <FaCog /> Generate
          </Button>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {isPending ? (
          <FormButton loading label='Loading...' />
        ) : (
          accounts?.map((account) => (
            <Card key={account.name}>
              <CardHeader>
                <CardTitle>{account.name}</CardTitle>
                <CardDescription>{account.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span
                  className={`${
                    account.balance > 0 ? 'text-green-500' : 'text-red-500'
                  } text-3xl`}
                >
                  <FormatNumber value={account.balance} />
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-5'>
        <div className='bg-white p-2'>
          {isPending ? (
            <FormButton loading label='Loading...' />
          ) : (
            <Table>
              <TableCaption>Last 10 deposit transactions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastTenDepositTransactions?.map((transaction, i) => (
                  <TableRow key={i}>
                    <TableCell>{transaction?.donor?.name}</TableCell>
                    <TableCell>{transaction?.account?.name}</TableCell>
                    <TableCell className='text-green-500'>
                      <FormatNumber value={transaction.amount} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <div className='bg-white p-2'>
          {isPending ? (
            <FormButton loading label='Loading...' />
          ) : (
            <Table>
              <TableCaption>Last 10 expense transactions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Payee</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastTenExpenseTransactions?.map((transaction, i) => (
                  <TableRow key={i}>
                    <TableCell>{transaction?.createdBy?.name}</TableCell>
                    <TableCell>{transaction?.account?.name}</TableCell>
                    <TableCell className='text-red-500'>
                      -<FormatNumber value={transaction.amount} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className='bg-white p-2'>
          {isPending ? (
            <FormButton loading label='Loading...' />
          ) : (
            <Table>
              <TableCaption>Last 10 highest balance donors</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastTenHighestBalanceDonors?.map((donor, i) => (
                  <TableRow key={i}>
                    <TableCell>{donor.name}</TableCell>
                    <TableCell>{donor?.mobile}</TableCell>
                    <TableCell className='text-green-500'>
                      <FormatNumber value={donor.balance} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
