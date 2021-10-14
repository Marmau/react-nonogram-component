import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { GoalHintsAtom } from '../utils/context'
import { generateHints as generateHints, getHintsCrossout } from '../utils/hints'
import {
  HintsCrossout
} from '../utils/types'
import { useBoard } from './useBoard'

export function useHints() {
  const [goalHints] = useRecoilState(GoalHintsAtom)
  const { currentBoard } = useBoard()

  const generateCrossout = useCallback((): HintsCrossout => {
    return getHintsCrossout(goalHints, generateHints(currentBoard))
  }, [goalHints, currentBoard])


  const getProgress = useCallback((): number => {
    const hintsCrossout = generateCrossout()
    const allLines = [
      ...hintsCrossout.rows,
      ...hintsCrossout.cols
    ]
    const allHints = allLines.flatMap(l => l.line)

    const crossouts = allHints.filter((c) => c.crossout)
    const overflowLines = allLines.filter(l => l.overflow)
    const invalidCrossout = overflowLines.flatMap(ol => ol.line)

    return Math.floor(((crossouts.length - invalidCrossout.length) / allHints.length) * 100)
  }, [generateCrossout])

  return {
    goalHints,
    getProgress
  }
}
