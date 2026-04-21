import { prisma } from '@/lib/prisma'
import { getSpendingInsights } from '@/utils/aiCategorization'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/groups/[id]/insights - Get spending insights for a group
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // Get all expenses
    const expenses = await prisma.expense.findMany({
      where: { groupId: id },
      include: {
        participants: true,
      },
    })

    // Calculate insights
    const insights = getSpendingInsights(expenses)

    // Calculate spending by category
    const spendingByCategory: Record<string, number> = {}
    expenses.forEach((expense) => {
      spendingByCategory[expense.category] = (spendingByCategory[expense.category] || 0) + expense.amount
    })

    // Calculate spending by user (who paid)
    const spendingByUser: Record<string, number> = {}
    expenses.forEach((expense) => {
      spendingByUser[expense.paidByUserId] = (spendingByUser[expense.paidByUserId] || 0) + expense.amount
    })

    // Get user details for spending by user
    const userSpending: Array<{ userId: string; userName: string; totalAmount: number }> = []
    for (const [userId, amount] of Object.entries(spendingByUser)) {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (user) {
        userSpending.push({ userId, userName: user.name, totalAmount: amount })
      }
    }

    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0)

    return NextResponse.json({
      insights,
      spendingByCategory,
      userSpending,
      totalSpending,
      expenseCount: expenses.length,
      averageExpense: expenses.length > 0 ? totalSpending / expenses.length : 0,
    })
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 })
  }
}
