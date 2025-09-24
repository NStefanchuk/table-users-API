import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
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

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(
          'https://68d45231214be68f8c6902f0.mockapi.io/users', {}
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
    <div>
      <table>
        <thead>
          <tr>
            <td>name</td>
            <td>surname</td>
            <td>age</td>
            <td>email</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.age}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <input
                type="text"
                name="name"
                onChange={handleChangeNewUser}
                value={newUser.name}
              />
            </td>
            <td>
              <input
                type="text"
                name="surname"
                onChange={handleChangeNewUser}
                value={newUser.surname}
              />
            </td>
            <td>
              <input
                type="text"
                name="age"
                onChange={handleChangeNewUser}
                value={newUser.age}
              />
            </td>
            <td>
              <input
                type="text"
                name="email"
                onChange={handleChangeNewUser}
                value={newUser.email}
              />
            </td>
            <td>
              <button>ADD</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default App
