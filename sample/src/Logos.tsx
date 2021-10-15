/** @jsxImportSource @emotion/react */
import { css } from "@mui/styled-engine"
import { Box } from "@mui/system"

export function Logos() {
  return (
    <Box
      m={1}
      css={css`
        position: absolute;
        top: 0px;
        right: 0px;
        display: flex;
      `}
    >
      <Box m={1}>
        <a rel="noreferrer" target="_blank" href="https://github.com/Marmau/react-nonogram-component">
          <img src="github.png" height="20" alt="github" />
        </a>
      </Box>
      <Box m={1}>
        <a rel="noreferrer" target="_blank" href="https://www.npmjs.com/package/react-nonogram-component">
          <img src="npm.png" height="20" alt="npmjs" />
        </a>
      </Box>
    </Box>
  )
}
