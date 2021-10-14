# React Nonogram Component

## Introduction

This is a React component to display a Nonogram grid from the solution. Hints are automatically computed, and updated depending on the player moves.

![Nonogram][illustration-img]

**Demo:** https://qrcode-nonogram.netlify.app/

## Usage

### Install
```bash
npm install react-nonogram-component
```

### Prerequisites

You need React > 17 in your dependencies.

### Example

```typescript
const solution = {
    rows: 2,
    cols: 2,
    values: [true, false, false, true]
}

<NonogramGrid solution={solution} />
```

A sample project is under the `sample/` directory.

### Style

CSS can be overriden via CSS variables.

Here are the default values:

```css
--game-grid-color: #444
--hint-font-family: monospace;
--hint-color: #000
--hint-crossout-color: #bbb
--hint-overflow-background, rgba(255, 0, 0, 0.1)
--game-board-background-color: #bbb;
--square-filled-background-color: #353235
--square-empty-background-color: #fff
--square-marked-background-color, #fff
--square-marked-symbol-color: #bbb;
--square-marked-symbol: "\\2738";
```

### Component parameters

`solution`: the solution for the grid

```typescript
export interface NonogramGridInput {
  values: (boolean | SquareValue.EMPTY | SquareValue.FILLED)[] // 1D array with all square values
  rows: number // number of rows
  cols: number // number of cols
}
```

`init`: initial grid displayed to the player

```typescript
type Init = (SquareValue.EMPTY | SquareValue.FILLED | SquareValue.MARKED)[] // 1D array with all square values
```

`onRefresh`: Event function: called each time the nonogram is refreshed. It allows the developer to interact with the grid.

```typescript
function onRefresh(action: NonogramActions): void

export interface NonogramActions {
  canUndo: boolean // true if user can undo its last move, else false
  canRedo: boolean // true if user can redo its last move, else false
  undo: () => void // undo the last move
  redo: () => void // redo the last move
  restart: () => void // restart the game
  setGridHidden: (hidden: boolean) => void // hide the borders of the grid
  nextState: (grid: SquareValue[]) => void // set  the next grid in history (1D array with all square values)
  getProgress: () => number // get the progress of the game in % (value from 0 to 100)
  getCurrentBoard: () => SquareValue[] // get the square values of the displayed board
}
```

## Build the lib

```bash
yarn build # one shot build
yarn watch # build when a file is modified (dev mode)
```

## Run the sample

```bash
cd sample/
yarn start
```

[illustration-img]: https://raw.github.com/Marmau/react-nonogram-component/master/illustration.png
