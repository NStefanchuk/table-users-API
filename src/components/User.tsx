import React, { useState, useEffect, ChangeEvent } from 'react'
import {
  TableCell,
  TableRow,
  TextField,
  Button,
  Checkbox,
  Stack,
  Tooltip,
  Chip,
  IconButton,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'

export interface UserData {
  id: string
  name: string
  surname: string
  age: number
  email: string
}

interface UserProps {
  userProp: UserData
  selected?: boolean
  onToggleSelect?: () => void
  onSave?: (data: UserData) => Promise<void> | void
  onDelete?: () => Promise<void> | void
  deleting?: boolean
}

const User: React.FC<UserProps> = ({
  userProp,
  selected = false,
  onToggleSelect = () => {},
  onSave = () => {},
  onDelete = () => {},
  deleting = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editUserData, setEditUserData] = useState<UserData>({ ...userProp })

  useEffect(() => {
    if (!isEditing) setEditUserData({ ...userProp })
  }, [userProp, isEditing])

  const handleChangeEditUser = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditUserData((prev) => ({
      ...prev,
      [name]: name === 'age' ? Number(value) || 0 : value,
    }))
  }

  const handleSave = async () => {
    if (
      !editUserData.name.trim() ||
      !editUserData.surname.trim() ||
      !editUserData.email.trim()
    )
      return
    await onSave(editUserData)
    setIsEditing(false)
  }

  return (
    <TableRow
      hover
      sx={{
        '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
      }}
    >
      {/* Checkbox for selection */}
      <TableCell width={56}>
        <Checkbox
          checked={selected}
          onChange={onToggleSelect}
          inputProps={{
            'aria-label': `Select ${userProp.name} ${userProp.surname}`,
          }}
        />
      </TableCell>

      {isEditing ? (
        <>
          <TableCell>
            <TextField
              name="name"
              size="small"
              value={editUserData.name}
              onChange={handleChangeEditUser}
            />
          </TableCell>
          <TableCell>
            <TextField
              name="surname"
              size="small"
              value={editUserData.surname}
              onChange={handleChangeEditUser}
            />
          </TableCell>
          <TableCell>
            <TextField
              name="age"
              size="small"
              value={editUserData.age}
              onChange={handleChangeEditUser}
            />
          </TableCell>
          <TableCell>
            <TextField
              name="email"
              size="small"
              value={editUserData.email}
              onChange={handleChangeEditUser}
            />
          </TableCell>
          <TableCell sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              size="small"
              color="success"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              startIcon={<CloseIcon />}
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                setEditUserData({ ...userProp })
                setIsEditing(false)
              }}
            >
              Cancel
            </Button>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell sx={{ fontWeight: 600 }}>{userProp.name}</TableCell>
          <TableCell>{userProp.surname}</TableCell>
          <TableCell>
            <Chip label={userProp.age ?? '-'} size="small" />
          </TableCell>
          <TableCell>{userProp.email}</TableCell>
          <TableCell>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={deleting ? 'Deleting…' : 'Delete'}>
                <span>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={onDelete}
                    disabled={deleting}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </TableCell>
        </>
      )}
    </TableRow>
  )
}

export default User
