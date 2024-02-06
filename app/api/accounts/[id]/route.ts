import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const { name, description, status } = await req.json()

    const accountObj = await prisma.account.findUnique({
      where: { id: params.id },
    })

    if (!accountObj) return getErrorResponse('Account not found', 404)

    const checkExistence =
      name &&
      params.id &&
      (await prisma.account.findFirst({
        where: {
          name,
          id: { not: params.id },
        },
      }))
    if (checkExistence) return getErrorResponse('Account already exist')

    await prisma.account.update({
      where: { id: params.id },
      data: {
        name: name?.trim(),
        description,
        status,
      },
    })

    return NextResponse.json({
      ...accountObj,
      message: 'Account has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const accountObj = await prisma.account.delete({
      where: { id: params.id },
    })

    if (!accountObj) return getErrorResponse('Account not removed', 404)

    return NextResponse.json({
      ...accountObj,
      message: 'Account has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
