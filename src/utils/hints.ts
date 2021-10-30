import { Matrix } from "./Matrix"
import {
  Crossout,
  HintCrossoutLine,
  Hints,
  HintsCrossout,
  LineAnalysis,
  LineAnalysisItem,
  SquareValue
} from "./types"

function last<T>(array: T[]): T {
  return array[array.length - 1]
}

function withoutLast<T>(array: T[]): T[] {
  return array.slice(0, array.length - 1)
}

export function generateHintsFor(line: SquareValue[]): number[] {
  const hints = line.reduce(
    (previous, current) => {
      const lastPrevious = last(previous)
      if (current === "filled") {
        return [...withoutLast(previous), lastPrevious + 1]
      } else if (lastPrevious) {
        return [...previous, 0]
      } else {
        return [...previous]
      }
    },
    [0]
  )

  if (hints.length > 1 && last(hints) === 0) {
    return withoutLast(hints)
  } else {
    return hints
  }
}

/**
 * Retrieve row and column hint numbers and return them.
 *
 * @return {Hints} Return Hints object containing two arrays (rows[], cols[]).
 */
export function generateHints(board: Matrix<SquareValue>) {
  const metaMatrix = board.metaMatrix

  const hintNumbers: Hints = {
    rows: Array.from(Array(metaMatrix.rows).keys()).map((row) =>
      generateHintsFor(board.getRow(row))
    ),
    cols: Array.from(Array(metaMatrix.cols).keys()).map((col) =>
      generateHintsFor(board.getCol(col))
    )
  }

  return hintNumbers
}

export function getCrossoutLine(
  goalHints: number[],
  currentHints: number[]
): HintCrossoutLine {
  const goalHintsCrossOut = goalHints.map((hint) => ({
    hint,
    crossout: false
  }))

  const currentHintsCrossOut = currentHints.map((hint) => ({
    hint,
    crossout: false
  }))

  let nbCrossout = 0

  let i = 0
  while (i < goalHints.length && goalHints[i] === currentHints[i]) {
    nbCrossout++
    goalHintsCrossOut[i].crossout = true
    currentHintsCrossOut[i].crossout = true
    i++
  }

  let j = 1
  while (
    j <= goalHints.length &&
    goalHints[goalHints.length - j] === currentHints[currentHints.length - j] &&
    !goalHintsCrossOut[goalHints.length - j].crossout &&
    !currentHintsCrossOut[currentHints.length - j].crossout
  ) {
    nbCrossout++
    goalHintsCrossOut[goalHints.length - j].crossout = true
    currentHintsCrossOut[currentHints.length - j].crossout = true
    j++
  }

  // let k = 0
  // while (k < goalHints.length) {
  //   if (
  //     goalHints[k] === currentHints[k] &&
  //     !goalHintsCrossOut[k].crossout &&
  //     !currentHintsCrossOut[k].crossout
  //   ) {
  //     nbCrossout++
  //     goalHintsCrossOut[k].crossout = true
  //     currentHintsCrossOut[k].crossout = true
  //   }
  //   k++
  // }

  // let l = 1
  // while (l <= goalHints.length) {
  //   if (
  //     goalHints[goalHints.length - l] ===
  //       currentHints[currentHints.length - l] &&
  //     !goalHintsCrossOut[goalHints.length - l].crossout &&
  //     !currentHintsCrossOut[currentHints.length - l].crossout
  //   ) {
  //     nbCrossout++
  //     goalHintsCrossOut[goalHints.length - l].crossout = true
  //     currentHintsCrossOut[currentHints.length - l].crossout = true
  //   }
  //   l++
  // }

  return {
    line: goalHintsCrossOut,
    overflow: currentHints.length > goalHints.length,
    completed: nbCrossout === goalHintsCrossOut.length
  }
}

type AppliableLineAnalysis = LineAnalysis
function appliableLineAnalysisForHint(
  hint: number,
  completeLineAnalysis: LineAnalysis
): AppliableLineAnalysis[] {
  const tailRecursion = (
    hint: number,
    lineAnalysis: LineAnalysis,
    acc: AppliableLineAnalysis[]
  ): AppliableLineAnalysis[] => {
    if (lineAnalysis.length === 0) {
      return acc
    }

    const [count, type] = lineAnalysis[0]
    if (type === "filled" && count === hint) {
      return acc.concat([lineAnalysis])
    } else if (
      type === "filled" &&
      count !== hint 
    ) {
      return tailRecursion(
        hint,
        [
          [hint, "wrong"],
          ...lineAnalysis
            .slice(1)
            .map(
              ([count, type]): LineAnalysisItem =>
                type === "free" ? [count, "wrong"] : [count, type]
            )
        ],
        acc
      )
    } else if (type === "wrong" && count >= hint) {
      return tailRecursion(
        hint,
        [[count - hint - 1, type], ...lineAnalysis.slice(1)],
        acc.concat([lineAnalysis])
      )
    } else if (type !== "filled" && count >= hint) {
      return tailRecursion(
        hint,
        [[count - hint - 1, type], ...lineAnalysis.slice(1)],
        acc.concat([lineAnalysis])
      )
    } else {
      return tailRecursion(hint, lineAnalysis.slice(1), acc)
    }
  }

  return tailRecursion(hint, completeLineAnalysis, [])
}

function applyHintToLineAnalysis(
  hint: number,
  lineAnalysis: AppliableLineAnalysis
): [Crossout, LineAnalysis] {
  const [first, ...others] = lineAnalysis

  const [count, type] = first
  if (count === hint && type === "filled") {
    return [true, others]
  } else {
    const newCount = count - hint - 1
    const newType = type === "free" ? "free" : "wrong"
    const crossout = type === "free" ? false : undefined

    if (newCount <= 0) {
      return [crossout, others]
    } else {
      return [crossout, [[newCount, newType], ...others]]
    }
  }
}

function computePossibleCrossouts(
  goalHints: number[],
  lineAnalysis: LineAnalysis
): Crossout[][] {
  const recursion = (
    remainingHints: number[],
    remainingLineAnalysis: LineAnalysis,
    current: Crossout[]
  ): Crossout[][] => {
    const [firstHint, ...lastHints] = remainingHints

    if (firstHint === undefined) {
      if (
        current.every((c) => c) ||
        remainingLineAnalysis.every((la) => la[1] !== "filled")
      ) {
        return [current]
      } else {
        return []
      }
    } else {
      const usableLineAnalysis = remainingLineAnalysis.slice(
        remainingLineAnalysis.findIndex(
          ([count, type]) =>
            (type !== "filled" && count >= remainingHints[0]) ||
            type === "filled"
        )
      )
     
      const appliables = appliableLineAnalysisForHint(
        firstHint,
        usableLineAnalysis
      )
      console.log("appliable", usableLineAnalysis, remainingHints, appliables)
      return appliables.flatMap((appliableLA) => {
        const [crossout, next] = applyHintToLineAnalysis(firstHint, appliableLA)
        return recursion(lastHints, next, current.concat(crossout))
      })
    }
  }

  return recursion(goalHints, lineAnalysis, [])
}

function computeAndAggregateCrossouts(
  goalHints: number[],
  lineAnalysis: LineAnalysis
): boolean[] {
  const allCrossoutsByLine = computePossibleCrossouts(goalHints, lineAnalysis)
  console.log("possible", allCrossoutsByLine)

  const possibleCrossoutsByLine = allCrossoutsByLine.filter((line) =>
    line.every((e) => e !== undefined)
  ) as boolean[][]

  if (allCrossoutsByLine.length === 0) {
    return goalHints.map(() => false)
  } else if (possibleCrossoutsByLine.length > 0) {
    return possibleCrossoutsByLine.reduce(
      (previous, current) => {
        return previous.map((_, i) => previous[i] && current[i])
      },
      goalHints.map(() => true)
    )
  } else {
    const undefinedCrossoutsByLine = allCrossoutsByLine
      .map(
        (line) =>
          [line, line.filter((e) => e === undefined).length] as [
            Crossout[],
            number
          ]
      )
      .filter(([_, countUndefined]) => countUndefined > 0)

    const minUndefinedInALine = undefinedCrossoutsByLine.reduce(
      (previous, [_, countUndefined]) => {
        return countUndefined < previous ? countUndefined : previous
      },
      Number.MAX_SAFE_INTEGER
    )
    const minUndefinedCrossoutsByLine = undefinedCrossoutsByLine
      .filter(([_, countUndefined]) => countUndefined === minUndefinedInALine)
      .map(([crossouts]) => crossouts)

    const asBoolean = minUndefinedCrossoutsByLine.map((line) =>
      line.map((e) => (e === undefined ? false : e))
    )
    return asBoolean.reduce(
      (previous, current) => {
        return previous.map((_, i) => previous[i] && current[i])
      },
      goalHints.map(() => true)
    )
  }
}

export function computeCrossoutLine(
  goalHints: number[],
  lineAnalysis: LineAnalysis
): HintCrossoutLine {
  const crossout = computeAndAggregateCrossouts(goalHints, lineAnalysis)

  return {
    completed: crossout.every((c) => c),
    line: goalHints.map((_, i) => ({
      crossout: crossout[i],
      hint: goalHints[i]
    })),
    overflow:
      lineAnalysis.filter((la) => la[1] === "filled").length > goalHints.length
  }
}

export function analyzeLine(line: SquareValue[]): LineAnalysis {
  const analysisItems: LineAnalysis = line.reduce(
    (previous, current) => {
      const [lastCount, lastType] = last(previous)
      if (current === "empty") {
        if (lastType === "filled") {
          return [...previous, [0, "free"]]
        } else {
          return [...withoutLast(previous), [lastCount + 1, "free"]]
        }
      } else if (current === "marked") {
        return [...previous, [0, "free"]]
      } else {
        if (lastType === "filled") {
          return [...withoutLast(previous), [lastCount + 1, "filled"]]
        } else {
          return [
            ...withoutLast(previous),
            [lastCount - 1, "free"],
            [1, "filled"]
          ]
        }
      }
    },
    [[0, "free"]] as LineAnalysis
  )

  return analysisItems.filter((i) => i[0] > 0)
}

export function generateCrossoutFor(
  line: SquareValue[],
  hints: number[]
): HintCrossoutLine {
  // return getCrossoutLine(hints, generateHintsFor(line))

  return computeCrossoutLine(hints, analyzeLine(line))
}

export function getHintCrossoutLines(
  goalHints: number[][],
  currentHints: number[][]
): HintCrossoutLine[] {
  return goalHints.map((_, i) => getCrossoutLine(goalHints[i], currentHints[i]))
}

export function getHintsCrossout(
  goalHints: Hints,
  currentHints: Hints
): HintsCrossout {
  return {
    rows: getHintCrossoutLines(goalHints.rows, currentHints.rows),
    cols: getHintCrossoutLines(goalHints.cols, currentHints.cols)
  }
}
