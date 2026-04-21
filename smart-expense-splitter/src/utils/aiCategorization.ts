// Simple expense categorization using keywords
const categoryPatterns: Record<string, RegExp> = {
  Food: /food|meal|restaurant|lunch|dinner|breakfast|coffee|pizza|burger|cafe|grocery|grocery store|groceries/i,
  Travel: /travel|taxi|uber|car|gas|fuel|parking|flight|train|bus|train ticket|parking|metro/i,
  Accommodation: /hotel|hostel|airbnb|rent|accommodation|motel|apartment|room|house/i,
  Entertainment: /movie|movie theater|cinema|concert|show|entertainment|ticket|park|museum|game|gaming/i,
  Shopping: /shop|shopping|store|clothes|clothing|shoes|book|purchase|mall|market/i,
  Utilities: /electricity|water|internet|phone|bill|utilities|service/i,
  Healthcare: /hospital|doctor|medicine|pharmacy|health|medical|clinic|health/i,
  Other: /other|misc|miscellaneous/i,
}

export function categorizeExpense(description: string): string {
  for (const [category, pattern] of Object.entries(categoryPatterns)) {
    if (pattern.test(description)) {
      return category
    }
  }
  return 'Other'
}

export async function categorizeWithAI(description: string): Promise<string> {
  try {
    // Try to use HuggingFace API if available
    const apiKey = process.env.HUGGING_FACE_API_KEY

    if (!apiKey) {
      // Fallback to keyword matching
      return categorizeExpense(description)
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        method: 'POST',
        body: JSON.stringify({
          inputs: description,
          parameters: {
            candidate_labels: [
              'Food',
              'Travel',
              'Accommodation',
              'Entertainment',
              'Shopping',
              'Utilities',
              'Healthcare',
              'Other',
            ],
          },
        }),
      }
    )

    if (!response.ok) {
      // Fallback to keyword matching
      return categorizeExpense(description)
    }

    const result = await response.json()
    return result.labels?.[0] || 'Other'
  } catch (error) {
    console.error('Error calling AI categorization:', error)
    // Fallback to keyword matching
    return categorizeExpense(description)
  }
}

export function getSpendingInsights(expenses: any[]): string[] {
  const insights: string[] = []

  // Calculate total spending
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  // Calculate spending by category
  const spendingByCategory: Record<string, number> = {}
  expenses.forEach((expense) => {
    spendingByCategory[expense.category] = (spendingByCategory[expense.category] || 0) + expense.amount
  })

  // Find highest spending category
  let highestCategory = ''
  let highestAmount = 0
  for (const [category, amount] of Object.entries(spendingByCategory)) {
    if (amount > highestAmount) {
      highestAmount = amount
      highestCategory = category
    }
  }

  if (highestCategory) {
    const percentage = ((highestAmount / totalSpending) * 100).toFixed(0)
    insights.push(`📊 You spent ${percentage}% on ${highestCategory}`)
  }

  // Check for unusual spending
  const avgExpense = totalSpending / expenses.length
  const largeExpenses = expenses.filter((e) => e.amount > avgExpense * 2)
  if (largeExpenses.length > 0) {
    insights.push(`💸 You have ${largeExpenses.length} large expenses (more than 2x average)`)
  }

  // Recent spending trend
  const thisWeekExpenses = expenses.filter(
    (exp) => new Date(exp.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  )
  if (thisWeekExpenses.length > 0) {
    const thisWeekTotal = thisWeekExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    insights.push(`📅 You spent ₹${thisWeekTotal.toFixed(2)} this week`)
  }

  return insights
}
