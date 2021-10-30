import { useCallback } from "react"
import { useRecoilValue } from "recoil"
import { CrossoutsAtom, GoalHintsAtom } from "../utils/context"

export function useHints() {
  const goalHints = useRecoilValue(GoalHintsAtom)
  const crossout = useRecoilValue(CrossoutsAtom)

  const getProgress = useCallback((): number => {
    const allLines = Array.from(crossout.values())
    const allHints = allLines.flatMap((l) => l.line)

    const crossouts = allHints.filter((c) => c.crossout)
    const overflowLines = allLines.filter((l) => l.overflow)
    const invalidCrossout = overflowLines.flatMap((ol) => ol.line)

    return Math.floor(
      ((crossouts.length - invalidCrossout.length) / allHints.length) * 100
    )
  }, [crossout])

  return {
    goalHints,
    getProgress
  }
}
