/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Button, IconButton, Box, Fab } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import {
  NonogramActions,
  NonogramGrid,
  SquareValue
} from "react-nonogram-component"
import VisibilityIcon from "@mui/icons-material/Visibility"
import RedoIcon from "@mui/icons-material/Redo"
import ReplayIcon from "@mui/icons-material/Replay"
import UndoIcon from "@mui/icons-material/Undo"
import HomeIcon from "@mui/icons-material/Home"
import qrcode from "qrcode"
import { useHistory, useParams } from "react-router"
import LZUTF8 from "lzutf8"

export function Nonogram() {
  const { base64 } = useParams<{ base64: string }>()
  const history = useHistory()

  const textToDiscover = useMemo(
    () =>
      (
        LZUTF8.decompress(base64, {
          inputEncoding: "Base64",
          outputEncoding: "String"
        }) as string
      ).slice(0, 200),
    [base64]
  )

  const goHome = useCallback(() => {
    history.push("/")
  }, [history])

  const qrModules = useMemo(() => {
    return qrcode.create(textToDiscover, {}).modules
  }, [textToDiscover])

  const solution = useMemo(
    () => ({
      values: ([...qrModules.data] as number[]).map((bit) => {
        return bit === 1
      }),
      rows: qrModules.size,
      cols: qrModules.size
    }),
    [qrModules]
  )

  const isInGroup = useCallback(
    (row: number, col: number) => {
      const groupsToReveal = [
        [0, 0, 8, 8],
        [0, solution.cols - 8, 8, solution.cols],
        [solution.rows - 8, 0, solution.rows, 8],
        [0, 6, solution.rows, 7],
        [6, 0, 7, solution.cols],
        qrModules.size >= 25
          ? [
              solution.rows - 7 - 2,
              solution.cols - 7 - 2,
              solution.rows - 7 + 3,
              solution.cols - 7 + 3
            ]
          : [0, 0, 0, 0]
      ]

      return groupsToReveal.some(
        (g) => row >= g[0] && row < g[2] && col >= g[1] && col < g[3]
      )
    },
    [solution, qrModules]
  )

  const init = useMemo(
    () => ({
      values: solution.values.map((v, i) => {
        const col = i % solution.cols
        const row = Math.floor(i / solution.cols)

        if (isInGroup(row, col)) {
          return v ? SquareValue.FILLED : SquareValue.MARKED
        } else {
          return SquareValue.EMPTY
        }
      }),
      rows: solution.rows,
      cols: solution.cols
    }),
    [solution, isInGroup]
  )

  const [actions, setActions] = useState<NonogramActions>({
    canRedo: false,
    canUndo: false,
    redo: () => {},
    undo: () => {},
    restart: () => {},
    setGridHidden: () => {},
    reset: () => {}
  })

  const refresh = useCallback(
    (newActions: NonogramActions) => {
      setActions(newActions)
    },
    [setActions]
  )

  const fontSize = document.documentElement.clientHeight / qrModules.size / 2.5
  return (
    <Box
      css={css`
        display: flex;
      `}
    >
      <Box
        css={css`
          font-size: ${fontSize}px;
          font-weight: 700;
          width: 90vmin;
          padding: 5px;
          --hint-font-family: monospace;
          --game-board-background-color: #bbb;
          --square-marked-symbol-color: yellow;
          --square-marked-symbol: "\/";
        `}
      >
        <NonogramGrid
          solution={solution}
          init={init}
          onRefresh={refresh}
        ></NonogramGrid>
      </Box>

      <Box
        m={2}
        mt={6}
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <Box m={1}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<UndoIcon />}
            disabled={!actions.canUndo}
            onClick={actions.undo}
          >
            Undo
          </Button>
        </Box>
        <Box m={1}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RedoIcon />}
            disabled={!actions.canRedo}
            onClick={actions.redo}
          >
            Redo
          </Button>
        </Box>
        <Box m={1}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ReplayIcon />}
            onClick={actions.restart}
          >
            Restart
          </Button>
        </Box>
        <Box m={1}>
          <IconButton
            color="primary"
            onMouseDown={() => actions.setGridHidden(true)}
            onMouseLeave={() => actions.setGridHidden(false)}
            onMouseUp={() => actions.setGridHidden(false)}
          >
            <VisibilityIcon />
          </IconButton>
        </Box>
      </Box>
      <Fab
        css={css`
          position: absolute;
          bottom: 16px;
          right: 16px;
        `}
        color="secondary"
        aria-label="home"
        onClick={goHome}
      >
        <HomeIcon />
      </Fab>
    </Box>
  )
}
