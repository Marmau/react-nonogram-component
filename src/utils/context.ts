import { atom, atomFamily, selector } from "recoil"
import { Matrix, MetaMatrix } from "./Matrix"
import { Hints, MouseButton, SquareValue } from "./types"

export const MouseButtonAtom = atom<MouseButton>({
  key: "MouseButton",
  default: "none",
})

export const MetaMatrixAtom = atom<MetaMatrix>({
  key: "MetaMatrix",
  default: new MetaMatrix(0, 0),
})

export const BoardCellAtomFamily = atomFamily<SquareValue, number>({
  key: "BoardCellAtomFamily",
  default: () => SquareValue.EMPTY,
})

export const currentBoardSelector = selector<Matrix<SquareValue>>({
  key: "currentBoardSelector",
  get: ({ get }) => {
    const metaMatrix = get(MetaMatrixAtom)

    const values = metaMatrix
      .all()
      .map((location) => get(BoardCellAtomFamily(location.index)))

    return new Matrix(values, metaMatrix)
  },
})

export const HistoryAtom = atom<Matrix<SquareValue>[]>({
  key: "History",
  default: []
})

export const HistoryStepNumberAtom = atom<number>({
  key: "HistoryStepNumber",
  default: 0
})

export const GoalHintsAtom = atom<Hints>({
  key: "GoalHints",
  default: {
    rows: [],
    cols: []
  }
})

export const CurrentHintsAtom = atom<Hints>({
  key: "CurrentHints",
  default: {
    rows: [],
    cols: []
  }
})

export const IsGridHiddenAtom = atom<boolean>({
  key: "IsGridHidden",
  default: false
})