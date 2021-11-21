import { Matrix } from "./Matrix"
import {
  AppliableLineAnalysis,
  AppliableLineAnalysisItem,
  Crossout,
  HintCrossoutLine,
  Hints,
  isFilled,
  isFree,
  LineAnalysis,
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

function appliableLineAnalysisForHint(
  hint: number,
  completeLineAnalysis: AppliableLineAnalysis
): AppliableLineAnalysis[] {
  const tailRecursion = (
    hint: number,
    lineAnalysis: AppliableLineAnalysis,
    acc: AppliableLineAnalysis[]
  ): AppliableLineAnalysis[] => {
    if (lineAnalysis.length === 0) {
      return acc
    }

    const [count, type] = lineAnalysis[0]
    if (isFilled(type) && count === hint) {
      return acc.concat([lineAnalysis])
    } else if (isFilled(type) && count !== hint) {
      return tailRecursion(
        hint,
        [
          [hint, "free_but"],
          ...lineAnalysis
            .slice(1)
            .map(([count, type], i): AppliableLineAnalysisItem => {
              if (isFree(type)) {
                return [count, "free_but"]
              } else if (i === 0) {
                return [count, "filled_but"]
              } else {
                return [count, type]
              }
            })
        ],
        acc
      )
    } else if (isFree(type) && count >= hint) {
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
): [Crossout, AppliableLineAnalysis] {
  const [first, ...others] = lineAnalysis

  const [count, type] = first
  if (count === hint && type === "filled") {
    return [true, others]
  } else if (count === hint && type === "filled_but") {
    return ["true_but", others]
  } else {
    const newCount = count - hint - 1
    const newType = type
    const crossout = type === "free" ? false : "false_but"

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
    remainingLineAnalysis: AppliableLineAnalysis,
    current: Crossout[]
  ): Crossout[][] => {
    const [firstHint, ...lastHints] = remainingHints

    if (firstHint === undefined) {
      if (current.every((c) => c === true || c === "true_but")) {
        return [current.map((c) => (c === "true_but" ? true : c))]
      } else if (remainingLineAnalysis.every((la) => !isFilled(la[1]))) {
        return [current]
      } else {
        return []
      }
    } else {
      const usableLineAnalysis = remainingLineAnalysis.slice(
        remainingLineAnalysis.findIndex(
          ([count, type]) =>
            (!isFilled(type) && count >= remainingHints[0]) || isFilled(type)
        )
      )

      const appliables = appliableLineAnalysisForHint(
        firstHint,
        usableLineAnalysis
      )

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
  if (goalHints[0] === 0) {
    return [true]
  }

  const allCrossoutsByLine = computePossibleCrossouts(goalHints, lineAnalysis)

  if (allCrossoutsByLine.length === 0) {
    return goalHints.map(() => false)
  } else {
    const butCrossoutsByLine = allCrossoutsByLine.map(
      (line) =>
        [
          line,
          line.filter((e) => e === "true_but").length,
          line.filter((e) => e === "false_but").length
        ] as [Crossout[], number, number]
    )

    const minButInALine = butCrossoutsByLine.reduce(
      (previous, [_, countTrueBut, countFalseBut]) => {
        const sum = countTrueBut + countFalseBut
        return sum < previous ? sum : previous
      },
      Number.MAX_SAFE_INTEGER
    )
    const minButCrossoutsByLine = butCrossoutsByLine.filter(
      ([_, countTrueBut, countFalseBut]) =>
        countTrueBut + countFalseBut === minButInALine
    )

    const maxTrueButInALine = minButCrossoutsByLine.reduce(
      (previous, [_, countTrueBut]) => {
        return countTrueBut > previous ? countTrueBut : previous
      },
      Number.MIN_SAFE_INTEGER
    )

    const maxTrueButCrossoutsByLine = minButCrossoutsByLine
      .filter(([_, countTrueBut]) => countTrueBut === maxTrueButInALine)
      .map(([crossouts]) => crossouts)

    return maxTrueButCrossoutsByLine
      .reduce(
        (previous, current) => {
          return previous.map((_, i) => {
            return !(
              previous[i] === false ||
              current[i] === false ||
              previous[i] === "false_but" ||
              current[i] === "false_but"
            )
          })
        },
        goalHints.map(() => "true_but")
      )
      .map((crossout) => {
        if (crossout === "false_but") {
          return false
        } else if (crossout === "true_but") {
          return true
        } else {
          return crossout
        }
      })
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
      (goalHints[0] === 0 &&
        lineAnalysis.filter((la) => la[1] === "filled").length > 0) ||
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
  return computeCrossoutLine(hints, analyzeLine(line))
}
