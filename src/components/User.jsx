import React, { useState, useEffect } from 'react'
import { TableCell, TableRow, TextField, Button, Checkbox } from '@mui/material'

const User = ({
  userProp,
  selected = false,
  onToggleSelect = () => {},
  onSave = () => {},      // <-- NEW: сохраняем наверх
  onDelete = () => {},
  deleting = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editUserData, setEditUserData] = useState({ ...userProp })

  useEffect(() => {
    if (!isEditing) setEditUserData({ ...userProp })
  }, [userProp, isEditing])

  const handleEditUser = () => {
    setEditUserData({ ...userProp })
    setIsEditing((prev) => !prev)
  }

  const handleChangeEditUser = (e) => {
    const { name, value } = e.target
    setEditUserData({ ...editUserData, [name]: value })
  }

  const handleSave = async () => {
    if (!editUserData.name || !editUserData.surname || !editUserData.email) return
    await onSave(editUserData)       // делегируем наверх
    setIsEditing(false)
  }

  return (
    <TableRow key={userProp.id} hover>
      {/* Selection */}
      <TableCell width={56}>
        <Checkbox
          checked={selected}
          onChange={onToggleSelect}
          inputProps={{ 'aria-label': `Select ${userProp.name} ${userProp.surname}` }}
        />
      </TableCell>

      {isEditing ? (
        <>
          <TableCell>
            <TextField name="name" size="small" value={editUserData.name} onChange={handleChangeEditUser} />
          </TableCell>
          <TableCell>
            <TextField name="surname" size="small" value={editUserData.surname} onChange={handleChangeEditUser} />
          </TableCell>
          <TableCell>
            <TextField name="age" size="small" value={editUserData.age} onChange={handleChangeEditUser} />
          </TableCell>
          <TableCell>
            <TextField name="email" size="small" value={editUserData.email} onChange={handleChangeEditUser} />
          </TableCell>
          <TableCell sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" color="success" onClick={handleSave}>SAVE</Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => { setEditUserData({ ...userProp }); setIsEditing(false) }}
            >
              CANCEL
            </Button>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell>{userProp.name}</TableCell>
          <TableCell>{userProp.surname}</TableCell>
          <TableCell>{userProp.age}</TableCell>
          <TableCell>{userProp.email}</TableCell>
          <TableCell style={{ display: 'flex', gap: '5px' }}>
            <Button variant="contained" size="small" onClick={handleEditUser}>EDIT</Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={onDelete}
              disabled={deleting}
            >
              {deleting ? 'DELETING…' : 'DELETE'}
            </Button>
          </TableCell>
        </>
      )}
    </TableRow>
  )
}

export default User
