import React, { useCallback, useState } from "react"
import { useRecoilState } from "recoil"
import { MouseButtonAtom } from "../utils/context"
import { CellLocation } from "../utils/Matrix"
import { MouseButton, SquareValue } from "../utils/types"
import { useBoard } from "./useBoard"

export function useMouse() {
  const { currentBoard } = useBoard()
  const [mouseButton, setMouseButton] =
    useRecoilState<MouseButton>(MouseButtonAtom)

  const [lastMousePosition, setLastMousePosition] = useState<
    CellLocation | undefined
  >(undefined)

  const [mouseSquareValue, setMouseSquareValue] = useState<SquareValue>(
    'empty'
  )

  const onMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const lastPositionSquareValue = currentBoard.at(lastMousePosition?.index ?? 0)
      setMouseSquareValue(currentBoard.at(lastMousePosition?.index ?? 0))
      
      if (event.button === 0 && event.type === "mousedown") {
        setMouseButton("left")
        if (lastPositionSquareValue === 'filled') {
          setMouseSquareValue('empty')
        } else {
          setMouseSquareValue('filled')
        }
      } else if (event.button === 2 && event.type === "mousedown") {
        setMouseButton("right")
        if (lastPositionSquareValue === 'marked') {
          setMouseSquareValue('empty')
        } else {
          setMouseSquareValue('marked')
        }
      }
    },
    [setMouseButton, currentBoard, setMouseSquareValue, lastMousePosition]
  )

  const onMouseUp = useCallback(
    (event: React.MouseEvent) => {
      setMouseButton("none")
    },
    [setMouseButton]
  )

  const onSquareMouseEnter = useCallback(
    (location: CellLocation) => {
      setLastMousePosition(location)
    },
    [setLastMousePosition]
  )

  const onSquareMouseLeave = useCallback(
    (location: CellLocation) => {
      setLastMousePosition(undefined)
    },
    [setLastMousePosition]
  )

  return {
    mouseButton,
    mouseSquareValue,
    onMouseUp,
    onMouseDown,
    lastMousePosition,
    onSquareMouseEnter,
    onSquareMouseLeave,
  }
}
