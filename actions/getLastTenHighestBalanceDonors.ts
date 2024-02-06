'use server'

import { prisma } from '@/lib/prisma.db'

export default async function getLastTenHighestBalanceDonors() {
  try {
    const donors = await prisma.donor.findMany({
      where: {
        status: 'ACTIVE',
        balance: {
          gt: 0,
        },
      },
      select: {
        balance: true,
        name: true,
        mobile: true,
      },
      take: 10,
      orderBy: [{ balance: 'desc' }],
    })

    return donors
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
