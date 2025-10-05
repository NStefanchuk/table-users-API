import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    secondary: { main: '#7c3aed' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { paddingTop: 10, paddingBottom: 10 },
        head: { fontWeight: 700, fontSize: 14 },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { transition: 'background-color .2s ease' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
})

export default theme
