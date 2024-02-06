'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getLastTenExpenseTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: 'ACTIVE',
        type: 'EXPENSE',
        paymentStatus: 'PAID',
      },
      select: {
        amount: true,
        description: true,
        account: {
          select: {
            name: true,
          },
        },
      },
      take: 10,
      orderBy: [{ activeAt: 'desc' }, { createdAt: 'desc' }],
    })

    return transactions
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
