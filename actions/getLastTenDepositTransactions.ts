'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getLastTenDepositTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: 'ACTIVE',
        type: 'DEPOSIT',
        paymentStatus: 'PAID',
      },
      select: {
        donor: {
          select: {
            name: true,
          },
        },
        amount: true,
        description: true,
        account: {
          select: {
            name: true,
          },
        },
      },
      take: 10,
      orderBy: [{ createdAt: 'desc' }, { activeAt: 'desc' }],
    })

    return transactions
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
