import { useCallback } from "react"
import { useRecoilState } from "recoil"
import { HistoryAtom, HistoryStepNumberAtom } from "../utils/context"
import { useBoard } from "./useBoard"

export function useHistory() {
  const { resetBoard, workingBoard, updateCurrentBoard } = useBoard()

  const [history, setHistory] = useRecoilState(HistoryAtom)
  const [stepNumber, setStepNumber] = useRecoilState(HistoryStepNumberAtom)

  /*
   * Append current board state to history of board states.
   *
   * Should be called whenever we finish changing square values.
   *
   * At the moment, this is called whenever we let go of a mouse button.
   * This means we can capture multiple square value changes in a single
   * append as long as the mouse button is held down and the cursor is
   * dragged over multiple squares.
   */
  const appendToHistory = useCallback(() => {
    if (!workingBoard.equals(history[history.length - 1])) {
      setHistory(history.concat(workingBoard))
      setStepNumber(history.length)
      updateCurrentBoard()
    }
  }, [setHistory, setStepNumber, history, workingBoard, updateCurrentBoard])

  /**
   * Undo the most recent action.
   * If there is no action to undo, do nothing.
   *
   * As soon as we commit a new action, we cut off any actions
   * in front of the current action in the action history.
   */
  const undoAction = useCallback(() => {
    if (stepNumber === 0) return

    resetBoard(history[stepNumber - 1])
    setStepNumber(stepNumber - 1)
  }, [history, resetBoard, stepNumber, setStepNumber])

  const redoAction = useCallback(() => {
    if (stepNumber === history.length - 1) return

    resetBoard(history[stepNumber + 1])
    setStepNumber(stepNumber + 1)
  }, [history, resetBoard, stepNumber, setStepNumber])

  const resetHistory = useCallback(() => {
    resetBoard(history[0])
    setHistory([history[0]])
    setStepNumber(0)
  }, [setHistory, resetBoard, setStepNumber, history])

  const canUndo = useCallback(() => stepNumber > 0, [stepNumber])
  const canRedo = useCallback(
    () => stepNumber < history.length - 1,
    [stepNumber, history]
  )

  return {
    stepNumber,
    setStepNumber,
    appendToHistory,
    undoAction,
    redoAction,
    resetHistory,
    canUndo: canUndo(),
    canRedo: canRedo(),
    historySize: history.length
  }
}
