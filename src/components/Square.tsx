import React, { useCallback, useMemo } from "react"
import { useRecoilValue } from "recoil"
import { BoardCellAtomFamily } from "../utils/context"
import { cssClasses } from "../utils/cssClasses"
import { CellLocation } from "../utils/Matrix"
import { SquareValue } from "../utils/types"

export interface SquareProps {
  location: CellLocation
  onSquareMouseEnter: (location: CellLocation) => void
  onSquareMouseLeave: (location: CellLocation) => void
}

export function Square({
  location,
  onSquareMouseEnter,
  onSquareMouseLeave
}: SquareProps) {
  const cellState = useRecoilValue(BoardCellAtomFamily(location.index))

  const onMouseEnter = useCallback(() => {
    onSquareMouseEnter(location)
  }, [onSquareMouseEnter, location])

  const onMouseLeave = useCallback(() => {
    onSquareMouseLeave(location)
  }, [onSquareMouseLeave, location])


  return (
    <div
      className={cssClasses(
        "square",
        location.row > 0 && location.row % 5 === 0 && "border-top",
        location.col > 0 && location.col % 5 === 0 && "border-left"
      )}
    >
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cssClasses("inner-square", cellState)}
      ></div>
    </div>
  )
}
