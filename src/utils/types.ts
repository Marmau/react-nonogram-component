export enum SquareValue {
  EMPTY = 'empty',
  FILLED = 'filled',
  MARKED = 'marked'
}

export type LineType = 'col' | 'row'

export interface NonogramGridInput<T> {
  values: T[]
  rows: number
  cols: number
}

/**
 * Structure that makes up the hint
 * number values.
 */
 export interface Hints {
  rows: number[][]
  cols: number[][]
}

export type MouseButton = "none" | "left" | "right"

export interface HintCrossout {
  hint: number
  crossout: boolean
}

export interface HintCrossoutLine {
  line: HintCrossout[]
  overflow: boolean
  completed: boolean
}

export interface HintsCrossout {
  rows: HintCrossoutLine[]
  cols: HintCrossoutLine[]
}

export interface NonogramActions {
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  restart: () => void
  setGridHidden: (hidden: boolean) => void
  reset: (matrix: SquareValue[][]) => void
}