export type SquareValue = "empty" | "filled" | "marked"

export type LineType = "col" | "row"

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

export type Crossout = true | false | "true_but" | "false_but"

export type LineAnalysisItemType = "free" | "filled"
export type LineAnalysisItem = [count: number, type: LineAnalysisItemType]

export type LineAnalysis = LineAnalysisItem[]

export type AppliableLineAnalysisItemType =
  | LineAnalysisItemType
  | "free_but"
  | "filled_but"
export type AppliableLineAnalysisItem = [
  count: number,
  type: AppliableLineAnalysisItemType
]
export type AppliableLineAnalysis = AppliableLineAnalysisItem[]

export function isFree(type: AppliableLineAnalysisItemType) {
  return type === "free" || type === "free_but"
}

export function isFilled(type: AppliableLineAnalysisItemType) {
  return type === "filled" || type === "filled_but"
}

export type MouseButton = "none" | "left" | "right"

export interface HintCrossout {
  hint: number
  crossout: Crossout
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
  nextState: (grid: SquareValue[]) => void
  getProgress: () => number
  getCurrentBoard: () => SquareValue[]
}
