import React from 'react'
import Meta from '@/components/Meta'

export const metadata = {
  ...Meta({
    title: 'Donors',
  }),
}

export default function DonorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
