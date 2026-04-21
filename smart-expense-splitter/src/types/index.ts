export interface User {
  id: string
  email: string
  name: string
}

export interface Group {
  id: string
  name: string
  members: GroupMember[]
  createdAt: Date
  updatedAt: Date
}

export interface GroupMember {
  id: string
  groupId: string
  userId: string
  user: User
}

export interface Expense {
  id: string
  groupId: string
  paidByUserId: string
  description: string
  amount: number
  category: string
  date: Date
  participants: Participant[]
  paidBy: User
}

export interface Participant {
  id: string
  expenseId: string
  userId: string
  amount: number
  user: User
}

export interface Balance {
  id: string
  groupId: string
  debtorId: string
  creditorId: string
  amount: number
}

export interface Settlement {
  id: string
  groupId: string
  debtorId: string
  creditorId: string
  amount: number
  status: 'pending' | 'completed'
}
