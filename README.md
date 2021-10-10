# React Nonogram Component

## Introduction

This is a React component to display a Nonogram grid from the solution. Hints are automatically processed, and updated depending on the player moves.

## Usage

Example:

```
const solution = {
    rows: 2,
    cols: 2,
    values: [true, false, false, true]
}

<NonogramGrid solution={solution} />
```

A sample project is under the `sample/` directory.

## Build the lib
```
yarn build # one shot build
yarn watch # build when a file is modified (dev mode)
```

## Run the sample
```
cd sample/
yarn start
```
