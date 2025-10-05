import {
  Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Button, Checkbox, TableSortLabel, Stack
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
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

  const headCell = (field, label, align) => (
    <TableCell
      sortDirection={sort.field === field ? sort.direction : false}
      align={align}
      sx={{ position: 'sticky', top: 0, background: 'background.paper', zIndex: 1 }}
    >
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
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell
            width={56}
            sx={{ position: 'sticky', top: 0, background: 'background.paper', zIndex: 2 }}
          >
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
          <TableCell sx={{ position: 'sticky', top: 0, background: 'background.paper', zIndex: 1 }}>
            <b>Actions</b>
          </TableCell>
          <TableCell sx={{ position: 'sticky', top: 0, background: 'background.paper' }} />
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center" sx={{ py: 6, opacity: 0.7 }}>
              No users match your filters.
            </TableCell>
          </TableRow>
        )}

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
            <Stack direction="row" spacing={1}>
              <Button startIcon={<AddIcon />} variant="contained" color="success" onClick={onAddUser}>
                Add
              </Button>
            </Stack>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
