import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Donors Transaction',
  }),
}

export default function DonorsTransactionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
