import { prisma } from '@/lib/prisma'

export async function calculateBalances(groupId: string) {
  // Get all expenses in the group
  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: {
      participants: {
        include: { user: true },
      },
      paidBy: true,
    },
  })

  // Calculate all balances
  const balances: Record<string, Record<string, number>> = {}

  for (const expense of expenses) {
    const paidBy = expense.paidByUserId

    // Initialize balance structure
    if (!balances[paidBy]) balances[paidBy] = {}
    if (!balances[expense.id]) balances[expense.id] = {}

    for (const participant of expense.participants) {
      const userId = participant.userId
      const amount = participant.amount

      // Initialize user balance
      if (!balances[userId]) balances[userId] = {}
      if (!balances[userId][paidBy]) balances[userId][paidBy] = 0
      if (!balances[paidBy][userId]) balances[paidBy][userId] = 0

      // Update balance: userId owes paidBy
      if (userId !== paidBy) {
        balances[userId][paidBy] = (balances[userId][paidBy] || 0) + amount
        balances[paidBy][userId] = (balances[paidBy][userId] || 0) - amount
      }
    }
  }

  return balances
}

export async function updateGroupBalances(groupId: string) {
  // Get all group members
  const members = await prisma.groupMember.findMany({
    where: { groupId },
    include: { user: true },
  })

  // Clear existing balances
  await prisma.balance.deleteMany({ where: { groupId } })

  // Calculate new balances
  const balances = await calculateBalances(groupId)

  // Save new balances
  for (const debtor in balances) {
    for (const creditor in balances[debtor]) {
      const amount = balances[debtor][creditor]
      if (amount > 0) {
        await prisma.balance.upsert({
          where: {
            groupId_debtorId_creditorId: {
              groupId,
              debtorId: debtor,
              creditorId: creditor,
            },
          },
          update: { amount },
          create: {
            groupId,
            debtorId: debtor,
            creditorId: creditor,
            amount,
          },
        })
      }
    }
  }
}

export function splitExpenseEqually(amount: number, participantCount: number): number {
  return Number((amount / participantCount).toFixed(2))
}

export function splitExpenseCustom(amount: number, shares: Record<string, number>): Record<string, number> {
  const total = Object.values(shares).reduce((sum, share) => sum + share, 0)
  const result: Record<string, number> = {}

  for (const userId in shares) {
    result[userId] = Number(((amount * shares[userId]) / total).toFixed(2))
  }

  return result
}
