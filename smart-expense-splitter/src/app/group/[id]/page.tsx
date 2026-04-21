'use client'

import axios from 'axios'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GroupPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  const [group, setGroup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'insights'>('expenses')
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)

  useEffect(() => {
    fetchGroup()
    const interval = setInterval(fetchGroup, 5000) // Refresh every 5s
    return () => clearInterval(interval)
  }, [groupId])

  const fetchGroup = async () => {
    try {
      const response = await axios.get(`/api/groups/${groupId}`)
      setGroup(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load group')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading group...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-cyan-600 hover:text-cyan-700 mb-2 inline-block">
              ← Back
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">{group?.name}</h1>
            <p className="text-gray-600 mt-1">{group?.members?.length || 0} members</p>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="btn-secondary"
            >
              + Add Member
            </button>
            <button onClick={() => setShowAddExpense(!showAddExpense)} className="btn-primary">
              + Add Expense
            </button>
          </div>
        </div>

        {/* Add Member Form */}
        {showAddMember && <AddMemberForm groupId={groupId} onSuccess={fetchGroup} />}

        {/* Add Expense Form */}
        {showAddExpense && (
          <AddExpenseForm
            groupId={groupId}
            members={group?.members || []}
            onSuccess={fetchGroup}
            onClose={() => setShowAddExpense(false)}
          />
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {(['expenses', 'balances', 'insights'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'expenses' && <ExpensesTab group={group} onDelete={fetchGroup} />}
        {activeTab === 'balances' && <BalancesTab groupId={groupId} members={group?.members || []} />}
        {activeTab === 'insights' && <InsightsTab groupId={groupId} />}
      </div>
    </div>
  )
}

function AddMemberForm({ groupId, onSuccess }: any) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await axios.post(`/api/groups/${groupId}/members`, { name, email })
      setName('')
      setEmail('')
      onSuccess()
      alert('Member added successfully')
    } catch (error) {
      alert('Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card mb-6">
      <h3 className="text-xl font-bold mb-4">Add New Member</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </form>
    </div>
  )
}

function AddExpenseForm({ groupId, members, onSuccess, onClose }: any) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidByUserId, setPaidByUserId] = useState(members[0]?.userId || '')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal')
  const [loading, setLoading] = useState(false)

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedMembers.length === 0) {
      alert('Please select at least one participant')
      return
    }

    try {
      setLoading(true)
      await axios.post(`/api/groups/${groupId}/expenses`, {
        description,
        amount: parseFloat(amount),
        paidByUserId,
        participantIds: selectedMembers,
        splitType,
      })
      setDescription('')
      setAmount('')
      setSelectedMembers([])
      onSuccess()
      onClose()
      alert('Expense added successfully')
    } catch (error) {
      alert('Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card mb-6">
      <h3 className="text-xl font-bold mb-4">Add New Expense</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Expense description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          className="input-field"
          required
        />
        <div>
          <label className="block text-sm font-semibold mb-2">Paid by</label>
          <select
            value={paidByUserId}
            onChange={(e) => setPaidByUserId(e.target.value)}
            className="input-field"
          >
            {members.map((member: any) => (
              <option key={member.userId} value={member.userId}>
                {member.user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Split among</label>
          <div className="space-y-2">
            {members.map((member: any) => (
              <label key={member.userId} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.userId)}
                  onChange={() => toggleMember(member.userId)}
                  className="mr-3 w-4 h-4 cursor-pointer"
                />
                <span className="cursor-pointer">{member.user.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function ExpensesTab({ group, onDelete }: any) {
  const handleDelete = async (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`/api/expenses/${expenseId}`)
        onDelete()
        alert('Expense deleted')
      } catch (error) {
        alert('Failed to delete expense')
      }
    }
  }

  return (
    <div className="space-y-3">
      {group?.expenses && group.expenses.length > 0 ? (
        group.expenses.map((expense: any) => (
          <div key={expense.id} className="card flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900">{expense.description}</h4>
              <p className="text-sm text-gray-600">
                Paid by <span className="font-semibold">{expense.paidBy.name}</span>
              </p>
              <p className="text-sm text-gray-600">Category: {expense.category}</p>
              <div className="mt-2">
                {expense.participants.map((p: any, i: number) => (
                  <p key={i} className="text-xs text-gray-500">
                    {p.user.name}: ₹{p.amount.toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-600">₹{expense.amount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
              <button
                onClick={() => handleDelete(expense.id)}
                className="text-red-600 hover:text-red-700 text-sm mt-2 underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-center py-8">No expenses yet</p>
      )}
    </div>
  )
}

function BalancesTab({ groupId, members }: any) {
  const [balances, setBalances] = useState<any>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBalances()
  }, [groupId])

  const fetchBalances = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/groups/${groupId}/balances`)
      setBalances(response.data.balances)
    } catch (error) {
      console.error('Error fetching balances:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading balances...</p>

  return (
    <div className="space-y-3">
      {balances && balances.length > 0 ? (
        balances.map((balance: any) => {
          const debtor = members.find((m: any) => m.userId === balance.debtorId)
          const creditor = members.find((m: any) => m.userId === balance.creditorId)
          return (
            <div key={balance.id} className="card flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {debtor?.user.name || 'Unknown'} owes {creditor?.user.name || 'Unknown'}
                </p>
              </div>
              <p className="text-2xl font-bold text-red-600">₹{balance.amount.toFixed(2)}</p>
            </div>
          )
        })
      ) : (
        <p className="text-gray-600 text-center py-8">All settled! 🎉</p>
      )}
    </div>
  )
}

function InsightsTab({ groupId }: any) {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsights()
  }, [groupId])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/groups/${groupId}/insights`)
      setInsights(response.data)
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading insights...</p>

  return (
    <div className="space-y-6">
      {insights?.insights && insights.insights.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-3">💡 Spending Insights</h3>
          <ul className="space-y-2">
            {insights.insights.map((insight: string, i: number) => (
              <li key={i} className="text-gray-700">
                • {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights?.spendingByCategory && Object.keys(insights.spendingByCategory).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-3">📊 Spending by Category</h3>
          <div className="space-y-2">
            {Object.entries(insights.spendingByCategory).map(([category, amount]: [string, any]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-700">{category}</span>
                <span className="font-semibold text-gray-900">₹{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights?.userSpending && insights.userSpending.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-3">👥 Spending by Member</h3>
          <div className="space-y-2">
            {insights.userSpending.map((user: any) => (
              <div key={user.userId} className="flex justify-between items-center">
                <span className="text-gray-700">{user.userName}</span>
                <span className="font-semibold text-gray-900">₹{user.totalAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights && (
        <div className="card bg-gradient-to-r from-cyan-100 to-blue-100">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Total Spending</p>
              <p className="text-2xl font-bold text-cyan-600">₹{insights.totalSpending?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-cyan-600">{insights.expenseCount}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Average Expense</p>
              <p className="text-2xl font-bold text-cyan-600">₹{insights.averageExpense?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
