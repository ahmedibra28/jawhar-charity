'use server'

import { prisma } from '@/lib/prisma.db'

export default async function generateExpenses() {
  try {
    await prisma.$transaction(async (prisma) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          status: 'PENDING',
          type: 'EXPENSE',
          paymentStatus: 'UNPAID',
          activeAt: {
            lte: new Date(),
          },
        },
      })

      await Promise.all(
        transactions.map(async (transaction) => {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              status: 'ACTIVE',
              paymentStatus: 'PAID',
            },
          })

          await prisma.account.update({
            where: { id: `${transaction.accountId}` },
            data: {
              balance: {
                decrement: transaction.amount,
              },
            },
          })

          await prisma.donor.update({
            where: { id: `${transaction.donorId}` },
            data: {
              balance: {
                decrement: Number(transaction.amount),
              },
            },
          })
        })
      )
    })

    return { status: 'success' }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
