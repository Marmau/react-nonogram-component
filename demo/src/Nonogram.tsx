/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import HomeIcon from "@mui/icons-material/Home"
import RedoIcon from "@mui/icons-material/Redo"
import ReplayIcon from "@mui/icons-material/Replay"
import UndoIcon from "@mui/icons-material/Undo"
import VisibilityIcon from "@mui/icons-material/Visibility"
import {
  Alert,
  Box,
  Button,
  Fab,
  IconButton,
  LinearProgress,
  Snackbar
} from "@mui/material"
import { Base64 } from "js-base64"
import qrcode from "qrcode"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  NonogramActions,
  NonogramGrid,
  SquareValue
} from "react-nonogram-component"
import { useHistory, useParams } from "react-router"
import { ShareButton } from "./ShareButton"
import { unshuffle } from "./shuffle"

export function Nonogram() {
  const { base64 } = useParams<{ base64: string }>()
  const [gameOver, setGameOver] = useState(false)
  const history = useHistory()

  const textToDiscover = useMemo(
    () => Base64.decode(unshuffle(base64)).slice(0, 75),
    [base64]
  )

  const goHome = useCallback(() => {
    history.push("/")
  }, [history])

  const qrModules = useMemo(() => {
    return qrcode.create(textToDiscover, {}).modules
  }, [textToDiscover])

  const cols = qrModules.size
  const rows = qrModules.size

  const solution = useMemo(
    () =>
      ([...qrModules.data] as number[]).map((bit) => {
        return bit === 1
      }),
    [qrModules]
  )

  const isInGroup = useCallback(
    (row: number, col: number) => {
      const groupsToReveal = [
        [0, 0, 8, 8],
        [0, cols - 8, 8, cols],
        [rows - 8, 0, rows, 8],
        [0, 6, rows, 7],
        [6, 0, 7, cols],
        qrModules.size >= 25
          ? [
              rows - 7 - 2,
              cols - 7 - 2,
              rows - 7 + 3,
              cols - 7 + 3
            ]
          : [0, 0, 0, 0]
      ]

      return groupsToReveal.some(
        (g) => row >= g[0] && row < g[2] && col >= g[1] && col < g[3]
      )
    },
    [qrModules, rows, cols]
  )

  const init = useMemo(() => {
    return solution.map((v, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)

      if (isInGroup(row, col)) {
        return v ? "filled" : "marked"
      } else {
        return "empty"
      }
    })
  }, [cols, solution, isInGroup])

  const [actions, setActions] = useState<NonogramActions | undefined>(undefined)

  // Use localstorage to save the game
  const loadSavedGridOnce = useRef<Record<string, any>>({})
  useEffect(() => {
    if (actions === undefined) {
      return
    }

    if (!loadSavedGridOnce.current[base64]) {
      const inLocalStorage = localStorage.getItem(base64)
      if (inLocalStorage) {
        const nextState = JSON.parse(inLocalStorage) as SquareValue[]
        actions.nextState(nextState)
      }

      loadSavedGridOnce.current = { [base64]: true }
    } else {
      const jsonBoard = JSON.stringify(actions.getCurrentBoard())
      localStorage.clear()
      localStorage.setItem(base64, jsonBoard)
    }
  }, [actions, base64])

  useEffect(() => {
    setGameOver(actions !== undefined && actions.getProgress() === 100)
  }, [setGameOver, actions])

  const refresh = useCallback(
    (newActions: NonogramActions) => {
      setActions(newActions)
    },
    [setActions]
  )

  const fontSize = document.documentElement.clientHeight / qrModules.size / 2.5
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={actions?.getProgress() ?? 0}
        />
      </Box>
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
            --square-marked-symbol-color: #9e9cbd;
          `}
        >
          <NonogramGrid
            rows={rows}
            cols={cols}
            solution={solution}
            init={init}
            onRefresh={refresh}
          />
        </Box>

        <Box
          m={2}
          mt={8}
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <Box
            m={1}
            pb={2}
            css={css`
              border-bottom: 1px solid #bbb;
            `}
          >
            <ShareButton />
          </Box>
          <Box m={1}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<UndoIcon />}
              disabled={!actions?.canUndo}
              onClick={actions?.undo}
            >
              Undo
            </Button>
          </Box>
          <Box m={1}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<RedoIcon />}
              disabled={!actions?.canRedo}
              onClick={actions?.redo}
            >
              Redo
            </Button>
          </Box>
          <Box m={1}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ReplayIcon />}
              onClick={actions?.restart}
            >
              Restart
            </Button>
          </Box>
          <Box m={1}>
            <IconButton
              color="primary"
              onMouseDown={() => actions?.setGridHidden(true)}
              onMouseLeave={() => actions?.setGridHidden(false)}
              onMouseUp={() => actions?.setGridHidden(false)}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
        </Box>
        <Fab
          css={css`
            position: fixed;
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

      <Snackbar open={gameOver} autoHideDuration={6000}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Well done!
        </Alert>
      </Snackbar>
    </>
  )
}
