/** @jsxImportSource @emotion/react */
import { css, jsx } from '@emotion/react'
import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { BoardCellAtomFamily, IsGridHiddenAtom } from '../utils/context'
import { cssClasses } from '../utils/cssClasses'
import { CellLocation } from '../utils/Matrix'
import { SquareValue } from '../utils/types'

export interface SquareProps {
  location: CellLocation
  onSquareMouseEnter: (location: CellLocation) => void
  onSquareMouseLeave: (location: CellLocation) => void
}

const cssSquareWrapper = css`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;
  min-height: 0;

  &:before {
    padding-top: 100%;
    content: '';
    float: left;
  }

  display: flex;
  color: #fff;
  cursor: pointer;
  padding: 0px;
  position: relative;

  &.border-bottom {
    box-shadow: 0px -1px 0px 0px #444;
  }

  &.border-right {
    box-shadow: -1px 0px 0px 0px #444;
  }

  &.border-bottom.border-right {
    box-shadow: -1px -1px 0px 0px #444;
  }

  &.hide-grid {
    background-color: transparent;
    box-shadow: 0px 0px 0px 0px transparent !important;

    .square {
      border-radius: initial;
      border: 0;
      height: 100%;
      width: 100%;

      &.marked {
        color: transparent;
      }
    }
  }

  .square {
    height: calc(100% - 2px);
    width: calc(100% - 2px);
    border-radius: 3px;
    border: solid 1px #bbb;

    display: flex;
    align-items: center;
    justify-content: center;

    @keyframes blink {
      from {
        box-shadow: 0 0 0 3px #1a7acd;
      }
      to {
        box-shadow: 0 0 0 3px #40ffdd;
      }
    }

    &:hover {
      animation-name: blink;
      animation-duration: 0.5s;
      animation-iteration-count: infinite;
      animation-direction: alternate;
      z-index: 1;
      cursor: pointer;
    }

    transition: background-color 0.2s ease, color 0.2s;

    &::after {
      transform: scale(0);
    }

    &.filled {
      background-color: #353235;
    }

    &.empty {
      background-color: #fff;
    }

    &.marked {
      background-color: #fff;
      color: #bbb;
      transition: color 0.2s;

      &::before {
        content: '\\2738';
        line-height: 100%;
      }
    }
  }
`

export function Square({
  location,
  onSquareMouseEnter,
  onSquareMouseLeave
}: SquareProps) {
  const cellState = useRecoilValue(BoardCellAtomFamily(location.index))

  const onMouseEnter = useCallback(() => {
    onSquareMouseEnter(location)
  }, [onSquareMouseEnter, location])

  const onMouseLeave = useCallback(() => {
    onSquareMouseLeave(location)
  }, [onSquareMouseLeave, location])

  const isGridHidden = useRecoilValue(IsGridHiddenAtom)

  const cssClassState = {
    [SquareValue.EMPTY]: 'empty',
    [SquareValue.MARKED]: 'marked',
    [SquareValue.FILLED]: 'filled'
  }

  return (
    <div
      css={cssSquareWrapper}
      className={cssClasses(
        isGridHidden && 'hide-grid',
        location.row > 0 && location.row % 5 === 0 && 'border-bottom',
        location.col > 0 && location.col % 5 === 0 && 'border-right',
      )}
    >
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cssClasses(
          'square',
          cssClassState[cellState],
          isGridHidden && 'hide-grid'
        )}
      ></div>
    </div>
  )
}
