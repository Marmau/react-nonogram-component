import React, { memo, useEffect, useMemo, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { useBoard } from "../hooks/useBoard"
import { useHints } from "../hooks/useHints"
import { CrossoutsAtom, HistoryStepNumberAtom } from "../utils/context"
import { cssClasses } from "../utils/cssClasses"
import { generateCrossoutFor } from "../utils/hints"
import { HintCrossoutLine, LineType, SquareValue } from "../utils/types"

export interface HintNumbersProps {
  lineType: LineType
}

function LineHintNumbers({
  line,
  goalHints,
  id
}: {
  line: SquareValue[]
  goalHints: number[]
  id: string
}) {
  const setCrossoutsAtom = useSetRecoilState(CrossoutsAtom)
  const [crossout, setCrossout] = useState<HintCrossoutLine>({
    completed: false,
    overflow: false,
    line: goalHints.map(hint => ({
      crossout: false,
      hint
    }))
  })

  // TODO: use a worker to delegate the computing of hints?
  useEffect(() => {
    setTimeout(() => {
      setCrossout(generateCrossoutFor(line, goalHints))
    }, Math.random() * 100)
  }, [line, goalHints])

  useEffect(() => {
    setCrossoutsAtom(crossoutMap => {
      const newCrossoutMap = new Map<string, HintCrossoutLine>(crossoutMap)
      newCrossoutMap.set(id, crossout)
      return newCrossoutMap
    })
  }, [crossout, id])

  return (
    <div
      className={cssClasses(
        "hint-group",
        crossout.overflow && crossout.completed && "overflow"
      )}
    >
      <div className={cssClasses("inner-hint-group")}>
        {crossout.line.map((co, i) => (
          <div
            key={i}
            className={cssClasses("hint", co.crossout && "crossout")}
          >
            {co.hint}
          </div>
        ))}
      </div>
    </div>
  )
}

const MemoLineHintNumbers = memo(LineHintNumbers, (prev, next) => {
  return (
    prev.line.join("") === next.line.join("") &&
    prev.goalHints.join("") === next.goalHints.join("")
  )
})

/**
 * Translates either row or column hint numbers into HTML div elements.
 *
 * The current hint numbers according to the current state of the board
 * are compared to the static goal hint numbers in order to "cross out"
 * some numbers in order to assist the user in figuring out what sequences
 * they've already finished.
 *
 * Crossed out hint numbers appear as a different color than normal hint numbers,
 * and are thus given a different div className than normal hint numbers.
 *
 */
export function HintNumbers({ lineType }: HintNumbersProps) {
  const { getLine } = useBoard()
  const { goalHints } = useHints()
  const stepNumber = useRecoilValue(HistoryStepNumberAtom)

  const goalHintsLines = useMemo(() => {
    return lineType === "row" ? goalHints.rows : goalHints.cols
  }, [lineType, goalHints])

  const hintGroups = useMemo(() => {
    return goalHintsLines.map((hintLine, i) => (
      <MemoLineHintNumbers
        key={i}
        id={lineType + i}
        goalHints={hintLine}
        line={getLine(lineType, i)}
      />
    ))
  }, [stepNumber, goalHintsLines, getLine])

  return (
    <div
      className={cssClasses(
        "hint-groups",
        lineType === "col" ? "col-hint-groups" : "row-hint-groups"
      )}
    >
      {hintGroups}
    </div>
  )
}
