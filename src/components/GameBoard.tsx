import React from "react";
import { CellLocation, MetaMatrix } from "../utils/Matrix";
import { Square } from "./Square";

export interface BoardProps {
  metaMatrix: MetaMatrix;
  onBoardMouseUp: (event: React.MouseEvent) => void;
  onBoardMouseDown: (event: React.MouseEvent) => void;
  onBoardMouseLeave: (event: React.MouseEvent) => void;
  onSquareMouseEnter: (location: CellLocation) => void;
  onSquareMouseLeave: (location: CellLocation) => void;
}

type InnerBoardProps = Omit<
  BoardProps,
  "onBoardMouseUp" | "onBoardMouseDown" | "onBoardMouseLeave"
>;

// const cssGameBoard = css`
//   display: flex;
//   flex-direction: column;
//   background-color: #bbb;
//   width: auto;
//   box-shadow: 0px 0px 0px 4px #bbb;
//   transition: background-color 0.2s ease;

//   &.hide-grid {
//     background-color: transparent;
//     box-shadow: 0px 0px 0px 5px transparent;
//   }

//   .board-row {
//     display: flex;
//     flex-flow: row;
//     justify-content: center;
//   }
// `

function InnerBoard(props: InnerBoardProps) {
  return (
    <React.Fragment>
      {props.metaMatrix.allRows().map((row, i) => {
        return (
          <div key={i} className="board-row">
            {row.map((location) => {
              return (
                <Square
                  key={location.index}
                  location={location}
                  onSquareMouseEnter={props.onSquareMouseEnter}
                  onSquareMouseLeave={props.onSquareMouseLeave}
                />
              );
            })}
          </div>
        );
      })}
    </React.Fragment>
  );
}

const MemoInnerBoard = React.memo(InnerBoard);

/**
 * A game board made up of squares.
 */
export function GameBoard(props: BoardProps) {
  return (
    <div
      className="game-board"
      onMouseUp={props.onBoardMouseUp}
      onMouseDown={props.onBoardMouseDown}
      onMouseLeave={props.onBoardMouseLeave}
    >
      <MemoInnerBoard
        metaMatrix={props.metaMatrix}
        onSquareMouseEnter={props.onSquareMouseEnter}
        onSquareMouseLeave={props.onSquareMouseLeave}
      />
    </div>
  );
}
