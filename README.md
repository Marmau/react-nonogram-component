# React Nonogram Component

## Introduction

This is a React component to display a Nonogram grid from the solution. Hints are automatically computed, and updated depending on the player moves.

![Nonogram][illustration-img]

**Demo:** https://qrcode-nonogram.netlify.app/

**Npm package:** https://www.npmjs.com/package/react-nonogram-component

## Usage

### Install
```bash
npm install react-nonogram-component
```

### Prerequisites

You need React > 17 in your dependencies.

### Example

```typescript
import { NonogramGrid } from "react-nonogram-component"

const rows = 2
const cols = 2
const solution = [true, false, false, true]

<NonogramGrid rows={rows} cols={cols} solution={solution} />
```

A demo project is under the `demo/` directory.

### Style

CSS can be overriden via CSS variables.

Here are the default values:

```css
--game-grid-color: #444;
--hint-font-family: monospace;
--hint-color: #000;
--hint-crossout-color: #bbb;
--hint-overflow-background: rgba(255, 0, 0, 0.1);
--game-board-background-color: #bbb;
--mouse-highlight-color: #f5e9e9;
--square-filled-background-color: #353235fa; # With transparency to display the mouse highlight
--square-empty-background-color: #fffffffa;
--square-marked-background-color: #fffffffa;
--square-marked-symbol-color: #bbb;
--square-marked-symbol: "\\2738";
```

### Component parameters

`rows`: Number of rows of the grid

`cols`: Number of columns of the grid

`solution`: the solution for the grid (1D array)

```typescript
type Solution = (boolean | SquareValue.EMPTY | SquareValue.FILLED)[] // 1D array with all square values
```

`init`: initial grid displayed to the player (1D array)

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
