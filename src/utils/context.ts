import { atom, atomFamily, selector } from "recoil";
import { Matrix, MetaMatrix } from "./Matrix";
import { Hints, MouseButton, SquareValue } from "./types";

export const MouseButtonAtom = atom<MouseButton>({
  key: "MouseButton",
  default: "none",
});

export const MetaMatrixAtom = atom<MetaMatrix>({
  key: "MetaMatrix",
  default: new MetaMatrix(0, 0),
});

export const BoardCellAtomFamily = atomFamily<SquareValue, number>({
  key: "BoardCellAtomFamily",
  default: () => SquareValue.EMPTY,
});

export const CurrentBoardAtom = atom<Matrix<SquareValue>>({
  key: "CurrentBoard",
  default: selector({
    key: "Selector/CurrentBoard",
    get: ({ get }) => {
      return Matrix.init(get(MetaMatrixAtom), SquareValue.EMPTY);
    },
  }),
});

export const WorkingBoardAtom = atom<Matrix<SquareValue>>({
  key: "WorkingBoard",
  default: selector({
    key: "Selector/WorkingBoard",
    get: ({ get }) => {
      return Matrix.init(get(MetaMatrixAtom), SquareValue.EMPTY);
    },
  }),
});


export const HistoryAtom = atom<Matrix<SquareValue>[]>({
  key: "History",
  default: [],
});

export const HistoryStepNumberAtom = atom<number>({
  key: "HistoryStepNumber",
  default: 0,
});

export const GoalHintsAtom = atom<Hints>({
  key: "GoalHints",
  default: {
    rows: [],
    cols: [],
  },
});

export const CurrentHintsAtom = atom<Hints>({
  key: "CurrentHints",
  default: {
    rows: [],
    cols: [],
  },
});

export const IsGridHiddenAtom = atom<boolean>({
  key: "IsGridHidden",
  default: false,
});
