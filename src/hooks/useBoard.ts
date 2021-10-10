import { useCallback } from "react"
import { useRecoilCallback } from "recoil"
import { BoardCellAtomFamily, currentBoardSelector } from "../utils/context"
import { Matrix } from "../utils/Matrix"
import { LineType, SquareValue } from "../utils/types"

export function useBoard() {
  const resetBoard = useRecoilCallback(
    ({ set }) =>
      (matrix: Matrix<SquareValue>) => {
        matrix.metaMatrix.all().forEach((location) => {
          set(
            BoardCellAtomFamily(location.index),
            matrix.at(location.index) ?? SquareValue.EMPTY
          )
        })
      },
    []
  )

  const getCurrentBoard = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        return snapshot.getLoadable(currentBoardSelector)
          .contents as Matrix<SquareValue>
      },
    []
  )

  const getLine = useCallback((lineType: LineType, index: number) => {
    return lineType === 'row' ? getCurrentBoard().getRow(index) : getCurrentBoard().getCol(index)
  }, [getCurrentBoard])

  const getLines = useCallback((lineType: LineType) => {
    return lineType === 'row' ? getCurrentBoard().getRows() : getCurrentBoard().getCols()
  }, [getCurrentBoard])

  return {
    resetBoard,
    getCurrentBoard,
    getLine,
    getLines
  }
}
