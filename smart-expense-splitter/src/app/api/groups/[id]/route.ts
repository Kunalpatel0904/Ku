import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/groups/[id] - Get a specific group
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: true },
        },
        expenses: {
          include: {
            paidBy: true,
            participants: {
              include: { user: true },
            },
          },
          orderBy: { date: 'desc' },
        },
        balances: true,
      },
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    return NextResponse.json(group)
  } catch (error) {
    console.error('Error fetching group:', error)
    return NextResponse.json({ error: 'Failed to fetch group' }, { status: 500 })
  }
}

// DELETE /api/groups/[id] - Delete a group
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const group = await prisma.group.delete({
      where: { id },
    })

    return NextResponse.json(group)
  } catch (error) {
    console.error('Error deleting group:', error)
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 })
  }
}
