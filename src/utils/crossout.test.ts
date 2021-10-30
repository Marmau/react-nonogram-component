import { computeCrossoutLine } from "./hints"

test("1 => [10 free][1 filled][10 free] => 1 (completed)", () => {
  expect(
    computeCrossoutLine(
      [1],
      [
        [10, "free"],
        [1, "filled"],
        [10, "free"]
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      }
    ],
    overflow: false,
    completed: true
  })
})

test("1 => [2 free][2 filled] => _", () => {
  expect(
    computeCrossoutLine(
      [1],
      [
        [2, "free"],
        [2, "filled"]
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: false
      }
    ],
    overflow: false,
    completed: false
  })
})

test("1 1 => [1 filled][1 free][1 filled] => 1 1 (completed)", () => {
  expect(
    computeCrossoutLine(
      [1, 1],
      [
        [1, "filled"],
        [1, "free"],
        [1, "filled"]
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 1,
        crossout: true
      }
    ],
    overflow: false,
    completed: true
  })
})

test("1 1 => x _ _ _ _ => 1 _", () => {
  expect(
    computeCrossoutLine(
      [1, 1],
      [
        [1, "filled"],
        [3, "free"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 1,
        crossout: false
      }
    ],
    overflow: false,
    completed: false
  })
})

test("1 1 => _ _ x _ _ => _ _", () => {
  expect(
    computeCrossoutLine(
      [1, 1],
      [
        [1, "free"],
        [1, "filled"],
        [1, "free"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: false
      },
      {
        hint: 1,
        crossout: false
      }
    ],
    overflow: false,
    completed: false
  })
})

test("1 1 => _ _ x _ x => 1 1 (completed)", () => {
  expect(
    computeCrossoutLine(
      [1, 1],
      [
        [3, "free"],
        [1, "filled"],
        [1, "filled"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 1,
        crossout: true
      }
    ],
    overflow: false,
    completed: true
  })
})

test("1 1 => _ _ x _ _ _ _ _ x _ _ _ _  => 1 1 (completed)", () => {
  expect(
    computeCrossoutLine(
      [1, 1],
      [
        [1, "free"],
        [1, "filled"],
        [3, "free"],
        [1, "filled"],
        [3, "free"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 1,
        crossout: true
      }
    ],
    overflow: false,
    completed: true
  })
})

test("2 1 2 => _ x x _ _ _ _ _ x _ _ _ _  => 2 1 _", () => {
  expect(
    computeCrossoutLine(
      [2, 1, 2],
      [
        [2, "filled"],
        [3, "free"],
        [1, "filled"],
        [3, "free"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 2,
        crossout: true
      },
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 2,
        crossout: false
      }
    ],
    overflow: false,
    completed: false
  })
})

test("2 1 2 => _ x x _ _ _ _ _ x x _ _ _ _  => 2 _ 2", () => {
  expect(
    computeCrossoutLine(
      [2, 1, 2],
      [
        [2, "filled"],
        [3, "free"],
        [2, "filled"],
        [3, "free"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 2,
        crossout: true
      },
      {
        hint: 1,
        crossout: false
      },
      {
        hint: 2,
        crossout: true
      }
    ],
    overflow: false,
    completed: false
  })
})

test("2 1 2 => _ x x x _ _ _ x _ x x _ _ _ _  => _ 1 2", () => {
  expect(
    computeCrossoutLine(
      [2, 1, 2],
      [
        [3, "filled"],
        [1, "free"],
        [1, "filled"],
        [2, "filled"],
        [3, "free"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 2,
        crossout: false
      },
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 2,
        crossout: true
      }
    ],
    overflow: false,
    completed: false
  })
})

test("2 1 2 => _ _ _ x x _ x x _ _ _ _  => _ _ _", () => {
  expect(
    computeCrossoutLine(
      [2, 1, 2],
      [
        [2, "free"],
        [2, "filled"],
        [2, "filled"],
        [3, "free"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 2,
        crossout: false
      },
      {
        hint: 1,
        crossout: false
      },
      {
        hint: 2,
        crossout: true
      }
    ],
    overflow: false,
    completed: false
  })
})

test("1 1 1 1 1 => x _ x x _ x x _ x _ x _ _   => 1 _ _ 1 _", () => {
  expect(
    computeCrossoutLine(
      [1, 1, 1, 1, 1],
      [
        [1, "filled"],
        [2, "filled"],
        [2, "filled"],
        [1, "filled"],
        [1, "filled"],
        [1, "free"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 1,
        crossout: false
      },
      {
        hint: 1,
        crossout: false
      },
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 1,
        crossout: false
      }
    ],
    overflow: false,
    completed: false
  })
})

test("1 2 3 => x _ x x _ x x x _ x _ x _ _   => 1 2 3 (overflow)", () => {
  expect(
    computeCrossoutLine(
      [1, 2, 3],
      [
        [1, "filled"],
        [2, "filled"],
        [3, "filled"],
        [1, "filled"],
        [1, "filled"],
        [1, "free"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 2,
        crossout: true
      },
      {
        hint: 3,
        crossout: true
      }
    ],
    overflow: true,
    completed: true
  })
})

test("1 2 3 => x _ x_ x x _ x x x   => 1 2 3 (overflow)", () => {
  expect(
    computeCrossoutLine(
      [1, 2, 3],
      [
        [1, "filled"],
        [1, "filled"],
        [2, "filled"],
        [3, "filled"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 2,
        crossout: true
      },
      {
        hint: 3,
        crossout: true
      }
    ],
    overflow: true,
    completed: true
  })
})

test("1 2 3 => x_ x x _ x _ x x x   => 1 2 3 (overflow)", () => {
  expect(
    computeCrossoutLine(
      [1, 2, 3],
      [
        [1, "filled"],
        [2, "filled"],
        [1, "filled"],
        [3, "filled"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 2,
        crossout: true
      },
      {
        hint: 3,
        crossout: true
      }
    ],
    overflow: true,
    completed: true
  })
})

test("7 2 1 7 => xxxxxxx _ _ x _ x xxxxxxx   => 7 _ 1 7", () => {
  expect(
    computeCrossoutLine(
      [7, 2, 1, 7],
      [
        [7, "filled"],
        [1, "free"],
        [1, "filled"],
        [1, "filled"],
        [7, "filled"],
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 7,
        crossout: true
      },
      {
        hint: 2,
        crossout: false
      },
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 7,
        crossout: true
      }
    ],
    overflow: false,
    completed: false
  })
})