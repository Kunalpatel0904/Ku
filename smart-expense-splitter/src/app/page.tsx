'use client'

import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/groups')
      setGroups(response.data)
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/groups', { name: newGroupName })
      setGroups([...groups, response.data])
      setNewGroupName('')
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating group:', error)
      alert('Failed to create group')
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">💰 Smart Expense Splitter</h1>
            <p className="text-gray-600 mt-2">Track and settle shared expenses effortlessly</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-lg"
          >
            + New Group
          </button>
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
              <form onSubmit={createGroup}>
                <input
                  type="text"
                  placeholder="Group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="input-field mb-4"
                  required
                />
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-xl text-gray-600 mb-4">No groups yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create your first group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group: any) => (
              <Link href={`/group/${group.id}`} key={group.id}>
                <div className="card cursor-pointer hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-gray-600">{group.members?.length || 0} members</p>
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
