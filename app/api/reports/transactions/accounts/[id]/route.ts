import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { prisma } from '@/lib/prisma.db'
import moment from 'moment'
import { NextResponse } from 'next/server'

interface Params {
  params: {
    id: string
  }
}

export async function GET(req: NextApiRequestExtended, { params }: Params) {
  try {
    await isAuth(req, params)

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const id = params.id

    const query = q
      ? {
          activeAt: {
            gte: moment(q).startOf('day').toISOString(),
            lte: moment(q).endOf('day').toISOString(),
          },
          accountId: id,
          status: 'ACTIVE',
        }
      : {
          accountId: id,
          status: 'ACTIVE',
        }

    const page = parseInt(searchParams.get('page') as string) || 1
    const pageSize = parseInt(searchParams.get('limit') as string) || 25
    const skip = (page - 1) * pageSize

    const [result, total] = await Promise.all([
      prisma.transaction.findMany({
        where: query as any,
        include: {
          account: {
            select: {
              name: true,
            },
          },
          donor: {
            select: {
              name: true,
            },
          },
          createdBy: {
            select: {
              name: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: [{ activeAt: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.transaction.count({
        where: query as any,
      }),
    ])

    const pages = Math.ceil(total / pageSize)

    const newResult = result.map((item) => {
      switch (item.type) {
        case 'DEPOSIT':
          item.amount = item.amount!
          return item
        case 'OPENING_BALANCE':
          item.amount = item.amount!
          return item
        case 'EXPENSE':
          item.amount = -item.amount!
          return item
        default:
          return item
      }
    })

    return NextResponse.json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: newResult,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
