import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { QueryMode, prisma } from '@/lib/prisma.db'
import { v4 as uuidv4 } from 'uuid'
import type { Status as IStatus } from '@prisma/client'

export async function GET(req: Request) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const status = {
      ...(searchParams.get('status') && {
        status: searchParams.get('status')?.toUpperCase(),
      }),
    } as { status: IStatus }

    const query = q
      ? {
          name: { contains: q, mode: QueryMode.insensitive },
          ...status,
        }
      : { ...status }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.account.findMany({
        where: query,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.account.count({ where: query }),
    ])

    const pages = Math.ceil(total / pageSize)

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function POST(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const { name, description, balance, period, status } = await req.json()

    if (balance && Number(balance) < 0)
      return getErrorResponse('Invalid amount', 400)

    const checkExistence =
      name &&
      (await prisma.account.findFirst({
        where: {
          name,
        },
      }))
    if (checkExistence) return getErrorResponse('Account already exist')

    const [account, transaction] = await prisma.$transaction(async (prisma) => {
      const account = await prisma.account.create({
        data: {
          name: name?.trim(),
          description,
          balance: parseFloat(balance) || 0,
          period,
          status,
          createdById: req.user.id,
        },
      })

      const transaction =
        Number(balance) > 0 &&
        (await prisma.transaction.create({
          data: {
            type: 'OPENING_BALANCE',
            amount: Number(balance),
            reference: uuidv4(),
            description: `Account opening balance for ${name?.trim()} account created by ${
              req.user.name
            }`,
            status: 'ACTIVE',
            paymentStatus: 'UNPAID',
            accountId: account.id,
            createdById: req.user.id,
            activeAt: new Date(),
          },
        }))

      return [account, transaction]
    })

    if (!account) return getErrorResponse('Error creating account', 500)

    return NextResponse.json({
      account,
      transaction,
      message: 'Account created successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
