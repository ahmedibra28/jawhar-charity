'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getAccounts() {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        name: true,
        balance: true,
        description: true,
      },
      orderBy: [{ balance: 'desc' }],
    })

    return accounts
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
