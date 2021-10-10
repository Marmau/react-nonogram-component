import React, { useCallback, useEffect } from "react"
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil"
import { useHistory } from "../hooks/useHistory"
import { useMouse } from "../hooks/useMouse"
import {
  BoardCellAtomFamily, IsGridHiddenAtom,
  MetaMatrixAtom,
  WorkingBoardAtom
} from "../utils/context"
import { cssClasses } from "../utils/cssClasses"
import { Matrix } from "../utils/Matrix"
import { NonogramActions, SquareValue } from "../utils/types"
import { GameBoard } from "./GameBoard"
import { HintNumbers } from "./HintNumbers"
import { gameControllerStyles } from "./styles"

export interface GameControllerProps {
  solution: Matrix<SquareValue>
  onRefresh: (nonogramActions: NonogramActions) => void
}

export const MemoBoard = React.memo(GameBoard)
export const MemoHintNumbers = React.memo(HintNumbers)

export function GameController({ solution, onRefresh }: GameControllerProps) {
  const metaMatrix = useRecoilValue(MetaMatrixAtom)

  const [isGridHidden, setGridHidden] = useRecoilState(IsGridHiddenAtom)

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
        if (lastMousePosition && mouseButton !== "none") {
          set(BoardCellAtomFamily(lastMousePosition.index), mouseSquareValue)
          set(WorkingBoardAtom, (matrix) =>
            matrix.setAt(lastMousePosition.index, mouseSquareValue)
          )
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
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={cssClasses(gameControllerStyles, isGridHidden && "hide-grid")}
    >
      <div className="area-col-hints">
        <MemoHintNumbers lineType="col" />
      </div>
      <div className="area-row-hints">
        <MemoHintNumbers lineType="row" />
      </div>
      <div className="area-board">
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
