import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { GoalHintsAtom } from '../utils/context'
import { generateHints as generateHints, generateHintsFor, getCrossoutLine, getHintsCrossout } from '../utils/hints'
import { Matrix } from '../utils/Matrix'
import {
  HintsCrossout, SquareValue
} from '../utils/types'
import { useBoard } from './useBoard'

export function useHints() {
  const [goalHints, setGoalHints] = useRecoilState(GoalHintsAtom)
  const { getCurrentBoard } = useBoard()

  const generateCrossout = useCallback((): HintsCrossout => {
    return getHintsCrossout(goalHints, generateHints(getCurrentBoard()))
  }, [goalHints, getCurrentBoard])


  const getProgress = useCallback((): number => {
    const hintsCrossout = generateCrossout()
    const allHints = [
      ...hintsCrossout.rows.map((r) => r.line).flat(),
      ...hintsCrossout.cols.map((r) => r.line).flat()
    ]
    const crossouts = allHints.filter((c) => c.crossout)

    return Math.floor((crossouts.length / allHints.length) * 100)
  }, [generateCrossout])

  return {
    goalHints,
    getProgress
  }
}
