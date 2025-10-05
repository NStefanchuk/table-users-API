import { CssBaseline, ThemeProvider } from '@mui/material'
import UsersPage from './components/UsersPage'
import theme from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UsersPage />
    </ThemeProvider>
  )
}
