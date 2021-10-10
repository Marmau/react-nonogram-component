/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react'
import { memo, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { useBoard } from '../hooks/useBoard'
import { useHints } from '../hooks/useHints'
import { HistoryStepNumberAtom, IsGridHiddenAtom } from '../utils/context'
import { cssClasses } from '../utils/cssClasses'
import { generateCrossoutFor } from '../utils/hints'
import { LineType, SquareValue } from '../utils/types'

export interface HintNumbersProps {
  lineType: LineType
}

const cssGroupHints = css`
  display: flex;
  justify-content: center;

  transition: opacity 0.2s ease;

  &.hidden {
    opacity: 0.3;
  }

  .hint-group {
    display: flex;
    flex: 1;
    justify-content: end;
    align-items: center;

    &.overflow {
      background: rgba(255, 0, 0, 0.1);
    }

    .inner-hint-group {
      display: flex;
      gap: 0;

      .hint {
        display: flex;
        align-items: center;
        color: #000;
        transition: color 0.2s ease 0s;

        &.crossout {
          color: #bbb;
        }
      }
    }
  }
`

const cssColHints = css`
  ${cssGroupHints}
  flex-direction: row;
  width: 100%;
  margin-bottom: 7px;

  .hint-group {
    flex-direction: column;

    .inner-hint-group {
      flex-direction: column;
      gap: 0;
      padding: 2px 0;

      .hint {
        margin: auto;
      }
    }
  }
`
const cssRowHints = css`
  ${cssGroupHints}
  flex-direction: column;
  height: 100%;
  margin-right: 10px;

  .hint-group {
    flex-direction: row;

    .inner-hint-group {
      flex-direction: row;
      gap: 0.4rem;
      padding: 0 2px;
    }
  }
`

function LineHintNumbers({
  line,
  goalHints
}: {
  line: SquareValue[]
  goalHints: number[]
}) {
  const crossout = useMemo(() => {
    return generateCrossoutFor(line, goalHints)
  }, [line, goalHints])

  return (
    <div
      className={cssClasses(
        'hint-group',
        crossout.overflow && crossout.completed && 'overflow'
      )}
    >
      <div className={cssClasses('inner-hint-group')}>
        {generateCrossoutFor(line, goalHints).line.map((co, i) => (
          <div
            key={i}
            className={cssClasses('hint', co.crossout && 'crossout')}
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
    prev.line.join('') === next.line.join('') &&
    prev.goalHints.join('') === next.goalHints.join('')
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

  const goalHintsLines = lineType === 'row' ? goalHints.rows : goalHints.cols
  const isGridHidden = useRecoilValue(IsGridHiddenAtom)

  const hintGroups = useMemo(
    () =>
      goalHintsLines.map((hintLine, i) => (
        <MemoLineHintNumbers
          key={i}
          goalHints={hintLine}
          line={getLine(lineType, i)}
        />
      )),
    [stepNumber, goalHintsLines, getLine]
  )

  return (
    <div
      className={cssClasses(isGridHidden && 'hidden')}
      css={lineType === 'col' ? cssColHints : cssRowHints}
    >
      {hintGroups}
    </div>
  )
}
