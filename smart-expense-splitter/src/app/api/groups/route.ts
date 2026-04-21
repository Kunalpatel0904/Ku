import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/groups - Get all groups
export async function GET(request: NextRequest) {
  try {
    const groups = await prisma.group.findMany({
      include: {
        members: {
          include: { user: true },
        },
        _count: {
          select: { expenses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(groups)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
  }
}

// POST /api/groups - Create a new group
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 })
    }

    const group = await prisma.group.create({
      data: { name },
      include: {
        members: {
          include: { user: true },
        },
      },
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
  }
}
