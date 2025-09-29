import React from 'react'
import { useState } from 'react'
import { TableCell, TableRow, TextField, Button } from '@mui/material'

const User = ({ userProp }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editUserData, setEditUserData] = useState({...userProp})

  const handleEditUser = () => {
    setIsEditing(!isEditing)
  }

    const handleChangeEditUser = (e) => {
    const { name, value } = e.target
    setEditUserData({ ...editUserData, [name]: value })
  }

  const handleUpdateUser = () => {
    if (!editUserData.name || !editUserData.surname || !editUserData.email) return
    try {
        
    } catch (e) {
       console.error(e) 
    }
  };


  return (
    <TableRow key={userProp.id}>
      {isEditing ? (
        <>
          <TableCell>
            <TextField name="name" size="small" value = {editUserData.name} onChange={handleChangeEditUser}/>
          </TableCell>
          <TableCell>
            <TextField name="surname" size="small" value = {editUserData.surname} onChange={handleChangeEditUser}/>
          </TableCell>
          <TableCell>
            <TextField name="age" size="small" value = {editUserData.age} onChange={handleChangeEditUser}/>
          </TableCell>
          <TableCell>
            <TextField name="email" size="small" value = {editUserData.email} onChange={handleChangeEditUser}/>
          </TableCell>
          <TableCell>
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={handleEditUser}
            >
              SAVE
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleEditUser}
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
            <Button variant="contained" size="small" onClick={handleEditUser}>
              EDIT
            </Button>
            <Button variant="contained" size="small" color="error">
              DELETE
            </Button>
          </TableCell>
        </>
      )}
    </TableRow>
  )
}

export default User
