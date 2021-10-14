import { useCallback } from "react"
import { useRecoilCallback, useRecoilState } from "recoil"
import {
  BoardCellAtomFamily,
  CurrentBoardAtom,
  WorkingBoardAtom
} from "../utils/context"
import { Matrix } from "../utils/Matrix"
import { LineType, SquareValue } from "../utils/types"

export function useBoard() {
  const [currentBoard, setCurrentBoard] = useRecoilState(CurrentBoardAtom)
  const [workingBoard, setWorkingBoard] = useRecoilState(WorkingBoardAtom)

  const resetBoard = useRecoilCallback(
    ({ set }) =>
      (matrix: Matrix<SquareValue>) => {
        matrix.metaMatrix.all().forEach((location) => {
          set(
            BoardCellAtomFamily(location.index),
            matrix.at(location.index) ?? 'empty'
          )
          setWorkingBoard(matrix)
          setCurrentBoard(matrix)
        })
      },
    [setWorkingBoard, setCurrentBoard]
  )

  const updateCurrentBoard = useCallback(() => {
    setCurrentBoard(workingBoard)
  }, [setCurrentBoard, workingBoard])

  const getBoardLine = useCallback(
    (lineType: LineType, index: number) => {
      return lineType === "row"
        ? currentBoard.getRow(index)
        : currentBoard.getCol(index)
    },
    [currentBoard]
  )

  return {
    resetBoard,
    currentBoard,
    workingBoard,
    updateCurrentBoard,
    getLine: getBoardLine
  }
}
