import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
} from '@mui/material'
import User from './components/User'

const BASE_URL = 'https://68d45231214be68f8c6902f0.mockapi.io/users'

function App() {
  const [users, setUsers] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [newUser, setNewUser] = useState({
    name: '',
    surname: '',
    age: '',
    email: '',
  })

  const handleChangeNewUser = (e) => {
    const { name, value } = e.target
    setNewUser({ ...newUser, [name]: value })
  }

  const handleUserUpdated = (updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
  }

  const handleDeleteUser = async (id) => {
    // оптимистично уберём строку из UI
    setBusyId(id)
    const prev = users
    setUsers((list) => list.filter((u) => u.id !== id))

    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete user')
    } catch (e) {
      console.error(e)
      // откат, если не получилось удалить на сервере
      setUsers(prev)
      alert('Не удалось удалить пользователя. Попробуйте ещё раз.')
    } finally {
      setBusyId(null)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.surname || !newUser.email) return

    try {
      const res = await fetch(
        'https://68d45231214be68f8c6902f0.mockapi.io/users',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newUser,
            age: Number(newUser.age) || 0,
          }),
        }
      )

      if (!res.ok) throw new Error('Failed to create user')
      const created = await res.json()

      setUsers((prev) => [created, ...prev])

      setNewUser({ name: '', surname: '', age: '', email: '' })
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(
          'https://68d45231214be68f8c6902f0.mockapi.io/users'
        )
        const usersData = await res.json()
        setUsers(usersData)
      } catch (e) {
        console.error(e)
      }
    }
    getUsers()
  }, [])

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 900, margin: '20px auto' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Name</b>
            </TableCell>
            <TableCell>
              <b>Surname</b>
            </TableCell>
            <TableCell>
              <b>Age</b>
            </TableCell>
            <TableCell>
              <b>Email</b>
            </TableCell>
            <TableCell>
              <b>Actions</b>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <User
              key={user.id}
              userProp={user}
              onUpdated={handleUserUpdated}
              onDelete={() => handleDeleteUser(user.id)}
              deleting={busyId === user.id}
            />
          ))}
          <TableRow>
            <TableCell>
              <TextField
                size="small"
                label="Name"
                name="name"
                value={newUser.name}
                onChange={handleChangeNewUser}
              />
            </TableCell>
            <TableCell>
              <TextField
                size="small"
                label="Surname"
                name="surname"
                value={newUser.surname}
                onChange={handleChangeNewUser}
              />
            </TableCell>
            <TableCell>
              <TextField
                size="small"
                label="Age"
                name="age"
                value={newUser.age}
                onChange={handleChangeNewUser}
              />
            </TableCell>
            <TableCell>
              <TextField
                size="small"
                label="Email"
                name="email"
                value={newUser.email}
                onChange={handleChangeNewUser}
              />
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddUser}
              >
                ADD
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default App
