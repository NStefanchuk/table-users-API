import { Toolbar, Stack, Typography, TextField, Slider, IconButton, Button } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

export default function FiltersBar({
  search, onSearchChange,
  ageRange, onAgeChange,
  minAge, maxAge,
  onResetFilters,
  selectedCount, onDeleteSelected, bulkDeleting,
}) {
  return (
    <Toolbar disableGutters sx={{ gap: 2, flexWrap: 'wrap', overflow: 'visible' }}>
      <Typography variant="h6" sx={{ mr: 'auto' }}>Users</Typography>

      <TextField
        size="small"
        label="Search (name, surname, email)"
        placeholder="Type to filter…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 300 }}
      />

      <Stack direction="row" spacing={2} alignItems="center" sx={{ overflow: 'visible' }}>
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>Age:</Typography>
        <Slider
          sx={{ width: 200, overflow: 'visible' }}
          value={ageRange}
          min={minAge} max={maxAge}
          onChange={(_, v) => onAgeChange(v)}
          valueLabelDisplay="auto"
          disableSwap
        />
        <IconButton aria-label="Reset filters" onClick={onResetFilters} size="small">
          <ClearIcon />
        </IconButton>
      </Stack>

      <Button
        variant="outlined" color="error"
        onClick={onDeleteSelected}
        disabled={selectedCount === 0 || bulkDeleting}
      >
        {bulkDeleting ? 'DELETING…' : `DELETE SELECTED (${selectedCount})`}
      </Button>
    </Toolbar>
  )
}
