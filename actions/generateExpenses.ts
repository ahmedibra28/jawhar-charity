'use server'

import DateTime from '@/lib/dateTime'
import { prisma } from '@/lib/prisma.db'

export default async function generateExpenses({ payee }: { payee?: string }) {
  try {
    if (!payee) return null

    await prisma.$transaction(async (prisma) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          status: 'PENDING',
          type: 'EXPENSE',
          paymentStatus: 'UNPAID',
          activeAt: {
            gte: DateTime().startOf('month').utc().toDate(),
            lte: DateTime().endOf('month').utc().toDate(),
          },
        },
      })

      if (transactions?.length > 0) {
        await Promise.all(
          transactions.map(async (transaction) => {
            await prisma.transaction.update({
              where: { id: transaction.id },
              data: {
                status: 'ACTIVE',
                paymentStatus: 'PAID',
                createdById: payee,
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
      }
    })

    return { status: 'success' }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
