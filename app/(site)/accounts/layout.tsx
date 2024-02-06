import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Accounts',
  }),
}

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
