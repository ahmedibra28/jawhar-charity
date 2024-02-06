import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Accounts Transaction',
  }),
}

export default function AccountsTransactionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
