import {
  Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Button, Checkbox, TableSortLabel
} from '@mui/material'
import User from './User'

export default function UsersTable({
  rows,
  sort, onSort,
  selectedIds, onToggleSelect, onToggleSelectAllVisible,
  busyId,
  onSaveRow, onDeleteRow,
  newUser, onChangeNewUser, onAddUser,
}) {
  const allVisibleSelected = rows.length > 0 && rows.every(u => selectedIds.has(u.id))
  const someVisibleSelected = rows.some(u => selectedIds.has(u.id)) && !allVisibleSelected

  const headCell = (field, label) => (
    <TableCell sortDirection={sort.field === field ? sort.direction : false}>
      <TableSortLabel
        active={sort.field === field}
        direction={sort.field === field ? sort.direction : 'asc'}
        onClick={() => onSort(field)}
      >
        <b>{label}</b>
      </TableSortLabel>
    </TableCell>
  )

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell width={56}>
            <Checkbox
              indeterminate={someVisibleSelected}
              checked={allVisibleSelected}
              onChange={onToggleSelectAllVisible}
              inputProps={{ 'aria-label': 'Select all visible users' }}
            />
          </TableCell>
          {headCell('name', 'Name')}
          {headCell('surname', 'Surname')}
          {headCell('age', 'Age')}
          {headCell('email', 'Email')}
          <TableCell><b>Actions</b></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map(user => (
          <User
            key={user.id}
            userProp={user}
            selected={selectedIds.has(user.id)}
            onToggleSelect={() => onToggleSelect(user.id)}
            onSave={(data) => onSaveRow(user.id, data)}
            onDelete={() => onDeleteRow(user.id)}
            deleting={busyId === user.id}
          />
        ))}

        {/* Add new user row */}
        <TableRow>
          <TableCell /> {/* selection column */}
          <TableCell>
            <TextField size="small" label="Name" name="name" value={newUser.name} onChange={onChangeNewUser} />
          </TableCell>
          <TableCell>
            <TextField size="small" label="Surname" name="surname" value={newUser.surname} onChange={onChangeNewUser} />
          </TableCell>
          <TableCell>
            <TextField size="small" label="Age" name="age" value={newUser.age} onChange={onChangeNewUser} />
          </TableCell>
          <TableCell>
            <TextField size="small" label="Email" name="email" value={newUser.email} onChange={onChangeNewUser} />
          </TableCell>
          <TableCell>
            <Button variant="contained" color="success" onClick={onAddUser}>ADD</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
