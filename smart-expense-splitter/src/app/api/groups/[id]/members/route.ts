import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/groups/[id]/members - Get group members
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const members = await prisma.groupMember.findMany({
      where: { groupId: id },
      include: { user: true },
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

// POST /api/groups/[id]/members - Add a member to group
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Create or find user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name },
    })

    // Check if already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId: user.id,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this group' },
        { status: 400 }
      )
    }

    // Add member to group
    const member = await prisma.groupMember.create({
      data: {
        groupId: id,
        userId: user.id,
      },
      include: { user: true },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error adding member:', error)
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 })
  }
}
