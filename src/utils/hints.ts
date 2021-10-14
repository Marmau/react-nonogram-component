import { Matrix } from "./Matrix"
import { HintCrossoutLine, Hints, HintsCrossout, SquareValue } from "./types"

function last(array: any[]) {
  return array[array.length - 1]
}

function withoutLast(array: any[]) {
  return array.slice(0, array.length - 1)
}

export function generateHintsFor(line: SquareValue[]): number[] {
  const hints = line.reduce(
    (previous, current) => {
      const lastPrevious = last(previous)
      if (current === 'filled') {
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

  let k = 0
  while (k < goalHints.length) {
    if (
      goalHints[k] === currentHints[k] &&
      !goalHintsCrossOut[k].crossout &&
      !currentHintsCrossOut[k].crossout
    ) {
      nbCrossout++
      goalHintsCrossOut[k].crossout = true
      currentHintsCrossOut[k].crossout = true
    }
    k++
  }

  let l = 1
  while (l <= goalHints.length) {
    if (
      goalHints[goalHints.length - l] ===
        currentHints[currentHints.length - l] &&
      !goalHintsCrossOut[goalHints.length - l].crossout &&
      !currentHintsCrossOut[currentHints.length - l].crossout
    ) {
      nbCrossout++
      goalHintsCrossOut[goalHints.length - l].crossout = true
      currentHintsCrossOut[currentHints.length - l].crossout = true
    }
    l++
  }

  return {
    line: goalHintsCrossOut,
    overflow: currentHints.length > goalHints.length,
    completed: nbCrossout === goalHintsCrossOut.length
  }
}

export function generateCrossoutFor(line: SquareValue[], hints: number[]) {
  return getCrossoutLine(hints, generateHintsFor(line))
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
