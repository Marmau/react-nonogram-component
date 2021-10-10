/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react'
import React, {
  useCallback,
  useEffect
} from 'react'
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'
import { useHistory } from '../hooks/useHistory'
import { useMouse } from '../hooks/useMouse'
import {
  BoardCellAtomFamily,
  IsGridHiddenAtom,
  MetaMatrixAtom
} from '../utils/context'
import { Matrix } from '../utils/Matrix'
import { NonogramActions, SquareValue } from '../utils/types'
import { GameBoard } from './GameBoard'
import { HintNumbers } from './HintNumbers'


export interface GameControllerProps {
  solution: Matrix<SquareValue>
  onRefresh: (nonogramActions: NonogramActions) => void
}

const cssGame = css`
  display: grid;
  grid-auto-columns: min-content;
  color: #353235;
  user-select: none;
  cursor: default;
  grid-template-areas:
    '. col-hints'
    'row-hints board';

  grid-template-rows: min-content 1fr;
  grid-template-columns: min-content 1fr;
  width: calc(100% - 5px);
  padding: 5px;
`

export const MemoBoard = React.memo(GameBoard)
export const MemoHintNumbers = React.memo(HintNumbers)

export function GameController({ solution, onRefresh }: GameControllerProps) {
  const metaMatrix = useRecoilValue(MetaMatrixAtom)

  const setGridHidden = useSetRecoilState(IsGridHiddenAtom)

  const {
    resetHistory,
    appendToHistory,
    undoAction,
    redoAction,
    canUndo,
    canRedo
  } = useHistory()

  const {
    onMouseDown,
    onMouseUp,
    mouseButton,
    mouseSquareValue,
    lastMousePosition,
    onSquareMouseEnter,
    onSquareMouseLeave
  } = useMouse()

  const onBoardMouseUp = useCallback(
    (event: React.MouseEvent) => {
      onMouseUp(event)
      appendToHistory()
    },
    [onMouseUp, appendToHistory]
  )

  const onBoardMouseDown = useCallback(
    (event: React.MouseEvent) => {
      onMouseDown(event)
    },
    [onMouseDown]
  )

  const updateSquare = useRecoilCallback(
    ({ set }) =>
      () => {
        if (lastMousePosition && mouseButton !== 'none') {
          set(BoardCellAtomFamily(lastMousePosition.index), mouseSquareValue)
        }
      },
    [mouseButton, lastMousePosition]
  )

  useEffect(() => {
    updateSquare()
  }, [updateSquare])

  useEffect(() => {
    onRefresh({
      canUndo,
      canRedo,
      setGridHidden,
      undo: undoAction,
      redo: redoAction,
      restart: resetHistory,
      reset: (matrix: SquareValue[][]) => {}
    })
  }, [
    onRefresh,
    canUndo,
    canRedo,
    setGridHidden,
    undoAction,
    redoAction,
    resetHistory
  ])

  return (
    <div onContextMenu={(e) => e.preventDefault()} css={cssGame}>
      <div css={{ gridArea: 'col-hints' }}>
        <MemoHintNumbers lineType='col' />
      </div>
      <div css={{ gridArea: 'row-hints' }}>
        <MemoHintNumbers lineType='row' />
      </div>
      <div css={{ gridArea: 'board' }}>
        <MemoBoard
          metaMatrix={metaMatrix}
          onBoardMouseUp={onBoardMouseUp}
          onBoardMouseDown={onBoardMouseDown}
          onBoardMouseLeave={onBoardMouseUp}
          onSquareMouseEnter={onSquareMouseEnter}
          onSquareMouseLeave={onSquareMouseLeave}
        />
      </div>
    </div>
  )
}
