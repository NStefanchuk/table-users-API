import {
  Toolbar,
  Stack,
  Typography,
  TextField,
  Slider,
  IconButton,
  Button,
  InputAdornment,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { ChangeEvent } from 'react'

interface FiltersBarProps {
  search: string
  onSearchChange(value: string): void
  ageRange: [number, number]
  onAgeChange(range: [number, number]): void
  minAge: number
  maxAge: number
  onResetFilters(): void
  selectedCount: number
  onDeleteSelected(): void
  bulkDeleting: boolean
}

export default function FiltersBar({
  search,
  onSearchChange,
  ageRange,
  onAgeChange,
  minAge,
  maxAge,
  onResetFilters,
  selectedCount,
  onDeleteSelected,
  bulkDeleting,
}: FiltersBarProps) {
  return (
    <Toolbar
      disableGutters
      sx={{
        gap: 2,
        flexWrap: 'wrap',
        overflow: 'visible',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ mr: 'auto' }}>
        Users
      </Typography>

      <TextField
        size="small"
        label="Search (name, surname, email)"
        placeholder="Type to filter…"
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onSearchChange(e.target.value)
        }
        sx={{ minWidth: 320 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ overflow: 'visible' }}
      >
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
          Age:
        </Typography>
        <Slider
          sx={{ width: 220, overflow: 'visible' }}
          value={ageRange}
          min={minAge}
          max={maxAge}
          onChange={(_, v) => {
            const arr = Array.isArray(v) ? v : [v, v]
            onAgeChange([arr[0] as number, arr[1] as number])
          }}
          valueLabelDisplay="auto"
          disableSwap
        />
        <IconButton
          aria-label="Reset filters"
          onClick={onResetFilters}
          size="small"
        >
          <ClearIcon />
        </IconButton>
      </Stack>

      <Button
        variant="outlined"
        color="error"
        onClick={onDeleteSelected}
        disabled={selectedCount === 0 || bulkDeleting}
      >
        {bulkDeleting ? 'Deleting…' : `Delete Selected (${selectedCount})`}
      </Button>
    </Toolbar>
  )
}
