import { prisma } from '@/lib/prisma'
import { updateGroupBalances } from '@/utils/balanceCalculation'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
  }
}

// DELETE /api/expenses/[id] - Delete an expense
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // Get expense to find the group
    const expense = await prisma.expense.findUnique({
      where: { id },
    })

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    // Delete expense (participants will be deleted via cascade)
    await prisma.expense.delete({
      where: { id },
    })

    // Update group balances
    await updateGroupBalances(expense.groupId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 })
  }
}
