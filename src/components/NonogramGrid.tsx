import * as React from 'react'
import { MutableSnapshot, RecoilRoot } from 'recoil'
import {
  BoardCellAtomFamily,
  CurrentBoardAtom,
  GoalHintsAtom,
  HistoryAtom,
  HistoryStepNumberAtom,
  MetaMatrixAtom,
  WorkingBoardAtom
} from '../utils/context'
import { generateHints } from '../utils/hints'
import { Matrix, MetaMatrix } from '../utils/Matrix'
import { NonogramGridInput, SquareValue, NonogramActions } from '../utils/types'
import { GameController } from './GameController'

interface NonogramGridProps {
  solution: NonogramGridInput<boolean | 'filled' | 'empty'>
  init?: SquareValue[]
  onRefresh?: (nonogramActions: NonogramActions) => void
}

function RecoilNonogramGrid({
  solution,
  init,
  onRefresh = () => {}
}: NonogramGridProps) {
  const solutionMatrix = React.useMemo(() => {
    return new Matrix(
      solution.values.map((elem) => {
        if (typeof elem === 'boolean') {
          return elem ? 'filled' : 'empty'
        } else {
          return elem
        }
      }),
      new MetaMatrix(solution.rows, solution.cols)
    )
  }, [solution])

  const initMatrix = React.useMemo(() => {
    return init
      ? new Matrix(init, new MetaMatrix(solution.rows, solution.cols))
      : undefined
  }, [init])

  const initializeState = React.useCallback(
    ({ set }: MutableSnapshot) => {
      const { metaMatrix } = solutionMatrix
      set(MetaMatrixAtom, metaMatrix)

      const realInit = initMatrix ?? Matrix.init(metaMatrix, 'empty')

      metaMatrix.all().forEach((location) => {
        set(
          BoardCellAtomFamily(location.index),
          realInit.at(location.index) ?? 'empty'
        )
      })

      set(CurrentBoardAtom, realInit)
      set(WorkingBoardAtom, realInit)

      const history = [realInit] as Matrix<SquareValue>[]

      set(HistoryAtom, history)
      set(HistoryStepNumberAtom, 0)

      set(GoalHintsAtom, generateHints(solutionMatrix))
    },
    [init, solution]
  )

  return (
    <div key={`${solutionMatrix?.toString()}_${initMatrix?.toString()}`}>
      <RecoilRoot initializeState={initializeState}>
        <GameController onRefresh={onRefresh} />
      </RecoilRoot>
    </div>
  )
}

export const NonogramGrid = React.memo(RecoilNonogramGrid, (prev, next) => {
  return (
    prev.onRefresh === next.onRefresh &&
    prev.solution === next.solution &&
    prev.init === next.init
  )
})
