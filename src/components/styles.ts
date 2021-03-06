import { css } from "@emotion/css"

export const gameControllerStyles = css`
  display: grid;
  grid-auto-columns: min-content;
  user-select: none;
  cursor: default;
  grid-template-areas:
    ". col-hints"
    "row-hints board";

  grid-template-rows: min-content 1fr;
  grid-template-columns: min-content 1fr;
  width: calc(100% - 5px);
  padding: 0 4px 4px 0;
  overflow: hidden;

  .area-col-hints {
    grid-area: col-hints;
  }

  .area-row-hints {
    grid-area: row-hints;
  }

  .area-board {
    grid-area: board;
  }

  &.hide-grid {
    .hint-groups {
      opacity: 0.2;
    }

    .game-board {
      background-color: transparent;
      box-shadow: 0px 0px 0px 5px transparent;
    }

    .square {
      background-color: transparent;
      box-shadow: 0px 0px 0px 0px transparent !important;

      .inner-square {
        border-radius: initial;
        border: 0;
        height: 100%;
        width: 100%;

        &.marked {
          color: transparent;
        }
      }
    }
  }

  .hint-groups {
    display: flex;
    justify-content: center;
    font-family: var(--hint-font-family, monospace);

    transition: opacity 0.2s ease;

    .hint-group {
      display: flex;
      flex: 1;
      justify-content: end;
      align-items: center;

      &.overflow {
        background: var(--hint-overflow-background, rgba(255, 0, 0, 0.1));
      }

      .inner-hint-group {
        display: flex;
        gap: 0;

        .hint {
          display: flex;
          align-items: center;
          color: var(--hint-color, #000);
          transition: color 0.2s ease 0s;

          &.crossout {
            color: var(--hint-crossout-color, #bbb);
          }
        }
      }
    }

    &.col-hint-groups {
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
    }

    &.row-hint-groups {
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
    }
  }

  .game-board {
    display: flex;
    flex-direction: column;
    width: auto;
    box-shadow: 0px 0px 0px 4px var(--game-board-background-color, #bbb);
    transition: background-color 0.2s ease;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      background-color: var(--square-empty-background-color, #fff);
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      z-index: -2;
    }

    .board-row {
      display: flex;
      flex-flow: row;
      justify-content: center;
    }
  }

  .square {
    display: flex;
    position: relative;
    color: #fff;
    cursor: pointer;
    padding: 0px;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0;
    min-height: 0;

    &:before {
      padding-top: 100%;
      content: "";
      float: left;
    }

    .square-borders {
      position: relative;
      width: 100%;
      height: 100%;
      box-shadow: #bbb 0 0 0px 1px inset;

      &::before {
        content: "";
        position: absolute;
        background-color: transparent;
        top: 0;
        left: -5000px;
        width: 10000px;
        height: 100%;
        z-index: -1;
      }

      &::after {
        content: "";
        position: absolute;
        background-color: transparent;
        left: 0;
        top: -5000px;
        height: 10000px;
        width: 100%;
        z-index: -1;
      }

      &:hover {
        &::before {
          background-color: var(--mouse-highlight-color, #f5e9e9);
        }

        &::after {
          background-color: var(--mouse-highlight-color, #f5e9e9);
        }
      }
    }

    &.border-top {
      box-shadow: 0px -1px 0px 0px var(--game-grid-color, #444);
    }

    &.border-left {
      box-shadow: -1px 0px 0px 0px var(--game-grid-color, #444);
    }

    &.border-top.border-left {
      box-shadow: -1px -1px 0px 0px var(--game-grid-color, #444);
    }

    .inner-square {
      position: relative;
      height: calc(100% - 2px);
      width: calc(100% - 2px);
      border-radius: 3px;
      border: solid 1px var(--game-board-background-color, #bbb);

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

      transition: background-color 0.4s ease, color 0.4s;

      &::after {
        transform: scale(0);
      }

      &.filled {
        background-color: var(--square-filled-background-color, #353235fa);
      }

      &.empty {
        background-color: var(--square-empty-background-color, #ffffffaa);
      }

      &.marked {
        background-color: var(--square-marked-background-color, #ffffffaa);
        color: var(--square-marked-symbol-color, #bbb);
        transition: color 0.4s;

        &::before {
          content: var(--square-marked-symbol, "\\2738");
          line-height: 100%;
        }
      }
    }
  }
`
