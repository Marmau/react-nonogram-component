import { useCallback, useEffect } from "react"
import { useRecoilState } from "recoil"
import { HistoryAtom, HistoryStepNumberAtom } from "../utils/context"
import { useBoard } from "./useBoard"

export function useHistory() {
  const { resetBoard, workingBoard, updateCurrentBoard, currentBoard } =
    useBoard()

  const [history, setHistory] = useRecoilState(HistoryAtom)
  const [stepNumber, setStepNumber] = useRecoilState(HistoryStepNumberAtom)

  /**
   * Update history
   */
  useEffect(() => {
    if (!currentBoard.equals(history[stepNumber])) {
      setHistory([
        ...history.slice(0, stepNumber + 1),
        currentBoard,
        ...history.slice(stepNumber + 2)
      ])
      setStepNumber((step) => step + 1)
    }
  }, [setHistory, setStepNumber, history, currentBoard])

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

  const cleanHistory = useCallback(() => {
    setHistory((history) => history.slice(0, stepNumber + 2))
  }, [setHistory, stepNumber])

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
    undoAction,
    redoAction,
    cleanHistory,
    resetHistory,
    canUndo: canUndo(),
    canRedo: canRedo(),
    historySize: history.length
  }
}
