import React, { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { BoardCellAtomFamily } from "../utils/context";
import { cssClasses } from "../utils/cssClasses";
import { CellLocation } from "../utils/Matrix";
import { SquareValue } from "../utils/types";

export interface SquareProps {
  location: CellLocation;
  onSquareMouseEnter: (location: CellLocation) => void;
  onSquareMouseLeave: (location: CellLocation) => void;
}

export function Square({
  location,
  onSquareMouseEnter,
  onSquareMouseLeave,
}: SquareProps) {
  const cellState = useRecoilValue(BoardCellAtomFamily(location.index));

  const onMouseEnter = useCallback(() => {
    onSquareMouseEnter(location);
  }, [onSquareMouseEnter, location]);

  const onMouseLeave = useCallback(() => {
    onSquareMouseLeave(location);
  }, [onSquareMouseLeave, location]);

  const cssClassState = useMemo(() => ({
    [SquareValue.EMPTY]: "empty",
    [SquareValue.MARKED]: "marked",
    [SquareValue.FILLED]: "filled",
  }), []);

  return (
    <div
      className={cssClasses(
        "square",
        location.row > 0 && location.row % 5 === 0 && "border-bottom",
        location.col > 0 && location.col % 5 === 0 && "border-right"
      )}
    >
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cssClasses("inner-square", cssClassState[cellState])}
      ></div>
    </div>
  );
}
