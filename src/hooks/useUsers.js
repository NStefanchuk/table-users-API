import { useEffect, useState, useCallback } from 'react'
import { UsersApi } from '../api/usersApi'

// нормализация: age → число (или '')
const normalizeUser = (u) => ({
  ...u,
  age: u?.age === '' ? '' : Number(u?.age) || 0,
})

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await UsersApi.list()
      setUsers(data.map(normalizeUser))
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const createUser = useCallback(async (payload) => {
    const created = await UsersApi.create(normalizeUser(payload))
    setUsers((prev) => [normalizeUser(created), ...prev])
    return created
  }, [])

  const updateUser = useCallback(async (id, payload) => {
    const updated = await UsersApi.update(id, normalizeUser(payload))
    setUsers((prev) => prev.map((u) => (u.id === id ? normalizeUser(updated) : u)))
    return updated
  }, [])

  const removeUser = useCallback(async (id) => {
    const prev = users
    setUsers((list) => list.filter((u) => u.id !== id))
    try {
      await UsersApi.remove(id)
    } catch (e) {
      setUsers(prev) // откат при ошибке
      throw e
    }
  }, [users])

  const removeMany = useCallback(async (ids) => {
    const setIds = new Set(ids)
    const prev = users
    setUsers((list) => list.filter((u) => !setIds.has(u.id)))
    try {
      await Promise.all(ids.map((id) => UsersApi.remove(id)))
    } catch (e) {
      setUsers(prev)
      throw e
    }
  }, [users])

  return { users, loading, error, refetch: fetchUsers, createUser, updateUser, removeUser, removeMany }
}
