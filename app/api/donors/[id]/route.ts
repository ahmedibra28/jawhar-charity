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

    const { name, sex, country, mobile, status } = await req.json()

    const donorObj = await prisma.donor.findUnique({
      where: { id: params.id },
    })

    if (!donorObj) return getErrorResponse('Donor not found', 404)

    const checkExistence =
      mobile &&
      params.id &&
      (await prisma.donor.findFirst({
        where: {
          mobile,
          id: { not: params.id },
        },
      }))
    if (checkExistence) return getErrorResponse('Donor already exist')

    await prisma.donor.update({
      where: { id: params.id },
      data: {
        name,
        sex,
        country,
        mobile,
        status,
      },
    })

    return NextResponse.json({
      ...donorObj,
      message: 'Donor has been updated successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await isAuth(req, params)

    const donorObj = await prisma.donor.delete({
      where: { id: params.id },
    })

    if (!donorObj) return getErrorResponse('Donor not removed', 404)

    return NextResponse.json({
      ...donorObj,
      message: 'Donor has been removed successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
