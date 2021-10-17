import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { Base64 } from "js-base64"
import { useCallback, useEffect, useState } from "react"
import AppsIcon from "@mui/icons-material/Apps"
import { useHistory } from "react-router"
import qrcode from "qrcode"
import { shuffle } from "./shuffle"

export function Home() {
  const [text, setText] = useState("")
  const [base64, setBase64] = useState("")
  const [qrDataUrl, setQrDataUrl] = useState("")
  const history = useHistory()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }

  useEffect(() => {
    if (text) {
      qrcode
        .toDataURL(text, {
          width: 300
        })
        .then((dataUrl) => {
          setQrDataUrl(dataUrl)
        })
      setBase64(shuffle(Base64.encode(text)))
    } else {
      setBase64("")
      setQrDataUrl("")
    }
  }, [text])

  const goNono = useCallback(() => {
    history.push(`/${base64}`)
  }, [history, base64])

  return (
    <Container maxWidth="xl">
      <Box p={2}>
        <Typography m={2}>
          Create a qrcode-nonogram based on the text below.
        </Typography>

        <form onSubmit={goNono}>
          <Box m={2}>
            <TextField
              label="Text to discover"
              value={text}
              variant="filled"
              inputProps={{ maxLength: 75 }}
              onChange={handleChange}
              fullWidth={true}
            />
          </Box>
          <Box m={2}>
            <Button
              disabled={text.length === 0}
              startIcon={<AppsIcon />}
              type="submit"
              variant="contained"
            >
              Generate nonogram
            </Button>
          </Box>
          <Box mt={2} sx={{ mx: "auto", width: "fit-content" }}>
            {qrDataUrl && <img src={qrDataUrl} alt="preview qr" />}
          </Box>
        </form>
      </Box>
    </Container>
  )
}
