import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Home } from './Home'
import { Nonogram } from './Nonogram'

const theme = createTheme({
  typography: {
    fontFamily: "monospace"
  },
  palette: {
    secondary: {
      main: grey[300]
    }
  }
})

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path='/:base64(.+)' render={() => <Nonogram />} />
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
}
