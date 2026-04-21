import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/groups/[id]/balances - Get all balances for a group
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const balances = await prisma.balance.findMany({
      where: { groupId: id },
    })

    // Also get group members info
    const members = await prisma.groupMember.findMany({
      where: { groupId: id },
      include: { user: true },
    })

    return NextResponse.json({ balances, members })
  } catch (error) {
    console.error('Error fetching balances:', error)
    return NextResponse.json({ error: 'Failed to fetch balances' }, { status: 500 })
  }
}
