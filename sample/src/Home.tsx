import { Box, Button, Container, TextField, Typography } from '@mui/material'
import LZUTF8 from 'lzutf8'
import { useCallback, useEffect, useState } from 'react'
import AppsIcon from '@mui/icons-material/Apps'
import { useHistory } from 'react-router'

export function Home() {
  const [text, setText] = useState('')
  const [base64, setBase64] = useState('')
  const history = useHistory()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }

  useEffect(() => {
    if (text) {
      setBase64(
        LZUTF8.compress(text, {
          outputEncoding: 'Base64'
        })
      )
    } else {
      setBase64('')
    }
  }, [text])

  const goNono = useCallback(() => {
    history.push(`/${base64}`)
  }, [history, base64])

  return (
    <Container maxWidth='xl'>
      <Typography m={2}>Create a qrcode-nonogram based on the text below.</Typography>

      <form onSubmit={goNono}>
        <Box m={2}>
          <TextField
            label='Text to discover'
            value={text}
            variant="filled"
            inputProps={{ maxLength: 200 }}
            onChange={handleChange}
            fullWidth={true}
          />
        </Box>
        <Box m={2}>
          <Button
            disabled={text.length === 0}
            startIcon={<AppsIcon />}
            type="submit"
            variant='contained'
          >
            Generate nonogram
          </Button>
        </Box>
      </form>
    </Container>
  )
}
