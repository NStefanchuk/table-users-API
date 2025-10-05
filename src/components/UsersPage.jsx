import { useMemo, useState } from 'react'
import { Paper, TableContainer, Box, LinearProgress } from '@mui/material'
import FiltersBar from './FiltersBar'
import UsersTable from './UsersTable'
import { useUsers } from '../hooks/useUsers'

const norm = (s = '') => String(s).toLowerCase().trim()

export default function UsersPage() {
  const { users, createUser, updateUser, removeUser, removeMany, loading } = useUsers()

  // filters
  const [search, setSearch] = useState('')
  const [ageRange, setAgeRange] = useState([0, 100])

  // sort
  const [sort, setSort] = useState({ field: null, direction: 'asc' })
  const handleSort = (field) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { field, direction: 'asc' }
    })
  }

  // selection
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [busyId, setBusyId] = useState(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const clearSelection = () => setSelectedIds(new Set())

  // new user form
  const [newUser, setNewUser] = useState({ name: '', surname: '', age: '', email: '' })
  const handleChangeNewUser = (e) => {
    const { name, value } = e.target
    setNewUser({ ...newUser, [name]: value })
  }

  // min/max for slider
  const [minAge, maxAge] = useMemo(() => {
    const ages = users.map(u => Number(u.age)).filter(Number.isFinite)
    return ages.length ? [Math.min(...ages), Math.max(...ages)] : [0, 100]
  }, [users])

  const safeAgeRange = useMemo(() => {
    const [lo, hi] = ageRange
    const lo2 = Math.max(minAge, Math.min(lo, maxAge))
    const hi2 = Math.max(minAge, Math.min(hi, maxAge))
    return lo2 <= hi2 ? [lo2, hi2] : [minAge, maxAge]
  }, [ageRange, minAge, maxAge])

  // filtered
  const filteredUsers = useMemo(() => {
    const q = norm(search)
    const [lo, hi] = safeAgeRange
    return users.filter(u => {
      const textOk =
        !q ||
        norm(u.name).includes(q) ||
        norm(u.surname).includes(q) ||
        norm(u.email).includes(q)
      const ageNum = Number(u.age)
      const ageOk = Number.isFinite(ageNum) ? ageNum >= lo && ageNum <= hi : true
      return textOk && ageOk
    })
  }, [users, search, safeAgeRange])

  // sorted
  const sortedUsers = useMemo(() => {
    if (!sort.field) return filteredUsers
    const arr = [...filteredUsers]
    const { field, direction } = sort
    arr.sort((a, b) => {
      if (field === 'age') {
        const an = Number(a.age) || 0
        const bn = Number(b.age) || 0
        return an - bn
      }
      return String(a[field] ?? '').localeCompare(String(b[field] ?? ''), undefined, { sensitivity: 'base' })
    })
    return direction === 'desc' ? arr.reverse() : arr
  }, [filteredUsers, sort])

  const resetFilters = () => {
    setSearch('')
    setAgeRange([minAge, maxAge])
  }

  const toggleSelectAllVisible = () => {
    setSelectedIds(prev => {
      const visibleIds = sortedUsers.map(u => u.id)
      const allSelected = visibleIds.every(id => prev.has(id))
      const next = new Set(prev)
      if (allSelected) visibleIds.forEach(id => next.delete(id))
      else visibleIds.forEach(id => next.add(id))
      return next
    })
  }

  // CRUD handlers
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.surname || !newUser.email) return
    try {
      await createUser({
        ...newUser,
        age: Number(newUser.age) || 0,
      })
      setNewUser({ name: '', surname: '', age: '', email: '' })
    } catch (e) {
      console.error(e)
      alert('Failed to create user')
    }
  }

  const handleSaveRow = async (id, data) => {
    try {
      await updateUser(id, data)
    } catch (e) {
      console.error(e)
      alert('Failed to update user')
    }
  }

  const handleDeleteRow = async (id) => {
    setBusyId(id)
    try {
      await removeUser(id)
      setSelectedIds(s => { const n = new Set(s); n.delete(id); return n })
    } catch (e) {
      console.error(e)
      alert('Could not delete the user. Please try again.')
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    setBulkDeleting(true)
    const ids = Array.from(selectedIds)
    try {
      await removeMany(ids)
      clearSelection()
    } catch (e) {
      console.error(e)
      alert('Failed to delete selected users.')
    } finally {
      setBulkDeleting(false)
    }
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: 980,
        m: '20px auto',
        overflow: 'visible',
        boxShadow: '0 8px 30px rgba(0,0,0,.08)',
      }}
    >
      <Box sx={{ px: 2.5, pt: 2.5, overflow: 'visible' }}>
        <FiltersBar
          search={search} onSearchChange={setSearch}
          ageRange={safeAgeRange} onAgeChange={setAgeRange}
          minAge={minAge} maxAge={maxAge}
          onResetFilters={resetFilters}
          selectedCount={selectedIds.size}
          onDeleteSelected={handleDeleteSelected}
          bulkDeleting={bulkDeleting}
        />
      </Box>

      {loading && <LinearProgress />}

      <UsersTable
        rows={sortedUsers}
        sort={sort}
        onSort={handleSort}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAllVisible={toggleSelectAllVisible}
        busyId={busyId}
        onSaveRow={handleSaveRow}
        onDeleteRow={handleDeleteRow}
        newUser={newUser}
        onChangeNewUser={handleChangeNewUser}
        onAddUser={handleAddUser}
      />
    </TableContainer>
  )
}
