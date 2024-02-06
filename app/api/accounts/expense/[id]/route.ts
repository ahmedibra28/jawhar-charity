import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { isAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma.db'
import { v4 as uuidv4 } from 'uuid'
import { currency } from '@/lib/currency'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: NextApiRequestExtended, { params }: Params) {
  try {
    await isAuth(req, params)

    const { amount, description } = await req.json()

    if (!amount || Number(amount) <= 0)
      return getErrorResponse('Invalid amount', 400)

    const object =
      params.id &&
      (await prisma.account.findFirst({
        where: { id: params.id, status: 'ACTIVE' },
      }))
    if (!object) return getErrorResponse('Account not found', 404)

    const totalPendingAmount = await prisma.transaction.aggregate({
      where: {
        accountId: params.id,
        paymentStatus: 'UNPAID',
        status: 'PENDING',
      },
      _sum: {
        amount: true,
      },
    })

    const totalPending = totalPendingAmount?._sum?.amount || 0

    if (Number(amount) > object.balance - totalPending)
      return getErrorResponse('Insufficient balance', 400)

    const [account, transaction] = await prisma.$transaction(async (prisma) => {
      const account = await prisma.account.update({
        where: { id: params.id },
        data: {
          balance: {
            decrement: Number(amount),
          },
        },
      })

      const transaction = await prisma.transaction.create({
        data: {
          type: 'EXPENSE',
          amount: Number(amount),
          reference: uuidv4(),
          description:
            description ||
            `Expense for ${currency(amount)} from by ${account.name}`,
          status: 'ACTIVE',
          paymentStatus: 'PAID',
          accountId: account.id,
          activeAt: new Date(),
          createdById: req.user.id,
        },
      })

      return [account, transaction]
    })

    if (!account) return getErrorResponse('Error creating account', 500)

    return NextResponse.json({
      account,
      transaction,
      message: 'Account expense successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
