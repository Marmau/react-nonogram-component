import { analyzeLine, generateHintsFor } from "./hints"

test("_ _ x _ _ => 1", () => {
  expect(
    generateHintsFor(["empty", "empty", "filled", "empty", "empty"])
  ).toStrictEqual([1])
})

test("x _ x x _ => 1 2", () => {
  expect(
    generateHintsFor(["filled", "empty", "filled", "filled", "empty"])
  ).toStrictEqual([1, 2])
})

test("x _ x x _ _ _ x => 1 2 1", () => {
  expect(
    generateHintsFor([
      "filled",
      "empty",
      "filled",
      "filled",
      "empty",
      "empty",
      "empty",
      "filled"
    ])
  ).toStrictEqual([1, 2, 1])
})

test("x _ x x _ _ _ x => {1 filled} {2 filled} {1 free} {1 filled}", () => {
  expect(
    analyzeLine([
      "filled",
      "empty",
      "filled",
      "filled",
      "empty",
      "empty",
      "empty",
      "filled"
    ])
  ).toStrictEqual([
    [1, "filled"],
    [2, "filled"],
    [1, "free"],
    [1, "filled"]
  ])
})

test("_ _ x x _ _ x _ _ _ _ m _ => {1 free} {2 filled} {1 filled} {3 free} {1 free}", () => {
  expect(
    analyzeLine([
      "empty",
      "empty",
      "filled",
      "filled",
      "empty",
      "empty",
      "filled",
      "empty",
      "empty",
      "empty",
      "empty",
      "marked",
      "empty"
    ])
  ).toStrictEqual([
    [1, "free"],
    [2, "filled"],
    [1, "filled"],
    [3, "free"],
    [1, "free"]
  ])
})
