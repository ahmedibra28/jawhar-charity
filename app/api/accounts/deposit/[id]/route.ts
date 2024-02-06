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

    const { amount, donorId, description, duration, startAt } = await req.json()

    if (!amount || Number(amount) <= 0)
      return getErrorResponse('Invalid amount', 400)

    const object =
      params.id &&
      (await prisma.account.findFirst({
        where: { id: params.id, status: 'ACTIVE' },
      }))
    if (!object) return getErrorResponse('Account not found', 404)

    const donorObj = await prisma.donor.findUnique({
      where: { id: `${donorId}` },
    })
    if (!donorObj) return getErrorResponse('Donor not found', 404)

    const [account, transaction] = await prisma.$transaction(async (prisma) => {
      const account = await prisma.account.update({
        where: { id: params.id },
        data: {
          balance: {
            increment: Number(amount),
          },
        },
      })

      await prisma.donor.update({
        where: { id: donorObj.id },
        data: {
          balance: {
            increment: Number(amount),
          },
        },
      })

      const reference = uuidv4()

      const transaction = await prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          amount: Number(amount),
          reference,
          description:
            description ||
            `Deposit for ${currency(amount)} from by ${
              donorObj.name
            } for ${duration} ${account.period?.toLowerCase()}`,
          status: 'ACTIVE',
          paymentStatus: 'PAID',
          donorId: donorId,
          accountId: account.id,
          activeAt: new Date(startAt) || new Date(),
          createdById: req.user.id,
        },
      })

      await Promise.all(
        Array.from({ length: Number(duration) }).map(async (_, index) => {
          const date = new Date(startAt)
          date.setMonth(date.getMonth() + index)
          date.setHours(new Date().getHours())
          date.setMinutes(new Date().getMinutes())
          date.setSeconds(new Date().getSeconds())

          await prisma.transaction.create({
            data: {
              type: 'EXPENSE',
              amount: Number(amount) / Number(duration),
              reference,
              description: `Expense for ${currency(amount)} from by ${
                donorObj.name
              } account for ${account.name?.toLowerCase()} `,
              status: 'PENDING',
              paymentStatus: 'UNPAID',
              donorId: donorId,
              accountId: account.id,
              activeAt: date,
              createdById: req.user.id,
            },
          })
        })
      )

      return [account, transaction]
    })

    if (!account) return getErrorResponse('Error creating account', 500)

    return NextResponse.json({
      account,
      transaction,
      message: 'Account deposited successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
