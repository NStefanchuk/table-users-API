import { useState, useEffect, useMemo } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Button, Paper, Toolbar, Stack, Typography, Slider, IconButton, Box, Checkbox, TableSortLabel
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import User from './components/User'

const BASE_URL = 'https://68d45231214be68f8c6902f0.mockapi.io/users'

// normalize helper
const norm = (s = '') => String(s).toLowerCase().trim()

function App() {
  const [users, setUsers] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [newUser, setNewUser] = useState({ name: '', surname: '', age: '', email: '' })

  // ---- filters ----
  const [search, setSearch] = useState('')
  const [ageRange, setAgeRange] = useState([0, 100])

  // ---- sorting ----
  const [sort, setSort] = useState({ field: null, direction: 'asc' })
  const handleSort = (field) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { field, direction: 'asc' }
    })
  }

  // min/max age for slider
  const [minAge, maxAge] = useMemo(() => {
    if (!users.length) return [0, 100]
    const ages = users.map(u => Number(u.age)).filter(n => Number.isFinite(n))
    return ages.length ? [Math.min(...ages), Math.max(...ages)] : [0, 100]
  }, [users])

  useEffect(() => {
    setAgeRange(prev => {
      const [lo, hi] = prev
      const lo2 = Math.max(minAge, Math.min(lo, maxAge))
      const hi2 = Math.max(minAge, Math.min(hi, maxAge))
      return lo2 <= hi2 ? [lo2, hi2] : [minAge, maxAge]
    })
  }, [minAge, maxAge])

  // filter
  const filteredUsers = useMemo(() => {
    const q = norm(search)
    const [lo, hi] = ageRange
    return users.filter(u => {
      const matchesText =
        !q ||
        norm(u.name).includes(q) ||
        norm(u.surname).includes(q) ||
        norm(u.email).includes(q)

      const ageNum = Number(u.age)
      const matchesAge = Number.isFinite(ageNum) ? ageNum >= lo && ageNum <= hi : true

      return matchesText && matchesAge
    })
  }, [users, search, ageRange])

  // sort (applied to filtered)
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
      const av = String(a[field] ?? '')
      const bv = String(b[field] ?? '')
      return av.localeCompare(bv, undefined, { sensitivity: 'base' })
    })

    return direction === 'desc' ? arr.reverse() : arr
  }, [filteredUsers, sort])

  // ---- selection helpers ----
  const isSelected = (id) => selectedIds.has(id)
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const clearSelection = () => setSelectedIds(new Set())

  const toggleSelectAllVisible = () => {
    setSelectedIds(prev => {
      const visibleIds = sortedUsers.map(u => u.id)
      const allSelected = visibleIds.every(id => prev.has(id))
      const next = new Set(prev)
      if (allSelected) {
        visibleIds.forEach(id => next.delete(id))
      } else {
        visibleIds.forEach(id => next.add(id))
      }
      return next
    })
  }

  // CRUD handlers
  const handleChangeNewUser = (e) => {
    const { name, value } = e.target
    setNewUser({ ...newUser, [name]: value })
  }

  const handleUserUpdated = (updated) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)))
  }

  const handleDeleteUser = async (id) => {
    setBusyId(id)
    const prev = users
    setUsers(list => list.filter(u => u.id !== id))
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete user')
      setSelectedIds(s => {
        const next = new Set(s); next.delete(id); return next
      })
    } catch (e) {
      console.error(e)
      setUsers(prev)
      alert('Could not delete the user. Please try again.')
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    setBulkDeleting(true)
    const ids = Array.from(selectedIds)
    const prev = users

    // optimistic remove
    setUsers(list => list.filter(u => !selectedIds.has(u.id)))

    try {
      const results = await Promise.allSettled(
        ids.map(id => fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }))
      )
      const failed = results.some(r => r.status === 'rejected' || (r.value && !r.value.ok))
      if (failed) {
        setUsers(prev)
        alert('Some deletions failed. Please try again.')
      } else {
        clearSelection()
      }
    } catch (e) {
      console.error(e)
      setUsers(prev)
      alert('Failed to delete selected users.')
    } finally {
      setBulkDeleting(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.surname || !newUser.email) return
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          age: Number(newUser.age) || 0,
        }),
      })
      if (!res.ok) throw new Error('Failed to create user')
      const created = await res.json()
      setUsers(prev => [created, ...prev])
      setNewUser({ name: '', surname: '', age: '', email: '' })
    } catch (e) {
      console.error(e)
    }
  }

  // initial load
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(BASE_URL)
        const usersData = await res.json()
        setUsers(usersData)
      } catch (e) {
        console.error(e)
      }
    }
    getUsers()
  }, [])

  const resetFilters = () => {
    setSearch('')
    setAgeRange([minAge, maxAge])
  }

  const allVisibleSelected =
    sortedUsers.length > 0 && sortedUsers.every(u => selectedIds.has(u.id))
  const someVisibleSelected =
    sortedUsers.some(u => selectedIds.has(u.id)) && !allVisibleSelected

  return (
    // Allow the value label to overflow the rounded Paper container
    <TableContainer component={Paper} sx={{ maxWidth: 900, m: '20px auto', overflow: 'visible' }}>
      {/* Filters header */}
      <Box sx={{ px: 2, pt: 2, overflow: 'visible' }}>
        <Toolbar disableGutters sx={{ gap: 2, flexWrap: 'wrap', overflow: 'visible' }}>
          <Typography variant="h6" sx={{ mr: 'auto' }}>Users</Typography>

          <TextField
            size="small"
            label="Search (name, surname, email)"
            placeholder="Type to filter…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 300 }}
          />

          <Stack direction="row" spacing={2} alignItems="center" sx={{ overflow: 'visible' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>Age:</Typography>
            <Slider
              sx={{ width: 200, overflow: 'visible' }}
              value={ageRange}
              min={minAge}
              max={maxAge}
              onChange={(_, v) => setAgeRange(v)}
              valueLabelDisplay="auto"
              disableSwap
            />
            <IconButton aria-label="Reset filters" onClick={resetFilters} size="small">
              <ClearIcon />
            </IconButton>
          </Stack>

          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0 || bulkDeleting}
          >
            {bulkDeleting ? 'DELETING…' : `DELETE SELECTED (${selectedIds.size})`}
          </Button>
        </Toolbar>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={56}>
              <Checkbox
                indeterminate={someVisibleSelected}
                checked={allVisibleSelected}
                onChange={toggleSelectAllVisible}
                inputProps={{ 'aria-label': 'Select all visible users' }}
              />
            </TableCell>

            <TableCell sortDirection={sort.field === 'name' ? sort.direction : false}>
              <TableSortLabel
                active={sort.field === 'name'}
                direction={sort.field === 'name' ? sort.direction : 'asc'}
                onClick={() => handleSort('name')}
              >
                <b>Name</b>
              </TableSortLabel>
            </TableCell>

            <TableCell sortDirection={sort.field === 'surname' ? sort.direction : false}>
              <TableSortLabel
                active={sort.field === 'surname'}
                direction={sort.field === 'surname' ? sort.direction : 'asc'}
                onClick={() => handleSort('surname')}
              >
                <b>Surname</b>
              </TableSortLabel>
            </TableCell>

            <TableCell sortDirection={sort.field === 'age' ? sort.direction : false}>
              <TableSortLabel
                active={sort.field === 'age'}
                direction={sort.field === 'age' ? sort.direction : 'asc'}
                onClick={() => handleSort('age')}
              >
                <b>Age</b>
              </TableSortLabel>
            </TableCell>

            <TableCell sortDirection={sort.field === 'email' ? sort.direction : false}>
              <TableSortLabel
                active={sort.field === 'email'}
                direction={sort.field === 'email' ? sort.direction : 'asc'}
                onClick={() => handleSort('email')}
              >
                <b>Email</b>
              </TableSortLabel>
            </TableCell>

            <TableCell><b>Actions</b></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedUsers.map(user => (
            <User
              key={user.id}
              userProp={user}
              selected={isSelected(user.id)}
              onToggleSelect={() => toggleSelect(user.id)}
              onUpdated={handleUserUpdated}
              onDelete={() => handleDeleteUser(user.id)}
              deleting={busyId === user.id}
            />
          ))}

          {/* Add new user row */}
          <TableRow>
            <TableCell /> {/* empty to align with selection column */}
            <TableCell>
              <TextField size="small" label="Name" name="name" value={newUser.name} onChange={handleChangeNewUser} />
            </TableCell>
            <TableCell>
              <TextField size="small" label="Surname" name="surname" value={newUser.surname} onChange={handleChangeNewUser} />
            </TableCell>
            <TableCell>
              <TextField size="small" label="Age" name="age" value={newUser.age} onChange={handleChangeNewUser} />
            </TableCell>
            <TableCell>
              <TextField size="small" label="Email" name="email" value={newUser.email} onChange={handleChangeNewUser} />
            </TableCell>
            <TableCell>
              <Button variant="contained" color="success" onClick={handleAddUser}>ADD</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default App
