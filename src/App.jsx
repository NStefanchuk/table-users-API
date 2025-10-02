import { useState, useEffect, useMemo } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Button, Paper, Toolbar, Stack, Typography, Slider, IconButton, Box
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import User from './components/User'

const BASE_URL = 'https://68d45231214be68f8c6902f0.mockapi.io/users'

// normalize helper
const norm = (s = '') => String(s).toLowerCase().trim()

function App() {
  const [users, setUsers] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [newUser, setNewUser] = useState({ name: '', surname: '', age: '', email: '' })

  // ---- filters ----
  const [search, setSearch] = useState('')
  const [ageRange, setAgeRange] = useState([0, 100])

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
    } catch (e) {
      console.error(e)
      setUsers(prev)
      alert('Could not delete the user. Please try again.')
    } finally {
      setBusyId(null)
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

  return (
    // Allow the value label to overflow the rounded Paper container
    <TableContainer component={Paper} sx={{ maxWidth: 900, m: '20px auto', overflow: 'visible' }}>
      {/* Put filters in their own Box with visible overflow so Slider labels aren’t clipped */}
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
              valueLabelDisplay="auto"      // shows the bubble only when sliding
              disableSwap
            />
            <IconButton aria-label="Reset filters" onClick={resetFilters} size="small">
              <ClearIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Surname</b></TableCell>
            <TableCell><b>Age</b></TableCell>
            <TableCell><b>Email</b></TableCell>
            <TableCell><b>Actions</b></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredUsers.map(user => (
            <User
              key={user.id}
              userProp={user}
              onUpdated={handleUserUpdated}
              onDelete={() => handleDeleteUser(user.id)}
              deleting={busyId === user.id}
            />
          ))}

          {/* Add new user row */}
          <TableRow>
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
