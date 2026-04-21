import { prisma } from '@/lib/prisma'
import { categorizeWithAI } from '@/utils/aiCategorization'
import { updateGroupBalances } from '@/utils/balanceCalculation'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/groups/[id]/expenses - Get all expenses for a group
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const expenses = await prisma.expense.findMany({
      where: { groupId: id },
      include: {
        paidBy: true,
        participants: {
          include: { user: true },
        },
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
  }
}

// POST /api/groups/[id]/expenses - Add a new expense
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const { description, amount, paidByUserId, participantIds, splitType, customSplits, date } =
      await request.json()

    if (!description || !amount || !paidByUserId || !participantIds) {
      return NextResponse.json(
        { error: 'Missing required fields: description, amount, paidByUserId, participantIds' },
        { status: 400 }
      )
    }

    // Categorize expense using AI
    const category = await categorizeWithAI(description)

    // Create the expense
    const expense = await prisma.expense.create({
      data: {
        groupId: id,
        description,
        amount: parseFloat(amount),
        paidByUserId,
        category,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        paidBy: true,
        participants: {
          include: { user: true },
        },
      },
    })

    // Calculate split amounts
    let splitAmounts: Record<string, number> = {}

    if (splitType === 'equal') {
      const perPersonAmount = amount / participantIds.length
      participantIds.forEach((userId: string) => {
        splitAmounts[userId] = parseFloat(perPersonAmount.toFixed(2))
      })
    } else if (splitType === 'custom' && customSplits) {
      splitAmounts = customSplits
    } else {
      // Default to equal split
      const perPersonAmount = amount / participantIds.length
      participantIds.forEach((userId: string) => {
        splitAmounts[userId] = parseFloat(perPersonAmount.toFixed(2))
      })
    }

    // Add participants
    for (const userId of participantIds) {
      await prisma.participant.create({
        data: {
          expenseId: expense.id,
          userId,
          amount: splitAmounts[userId] || 0,
        },
      })
    }

    // Update group balances
    await updateGroupBalances(id)

    // Fetch updated expense with participants
    const updatedExpense = await prisma.expense.findUnique({
      where: { id: expense.id },
      include: {
        paidBy: true,
        participants: {
          include: { user: true },
        },
      },
    })

    return NextResponse.json(updatedExpense, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
  }
}
