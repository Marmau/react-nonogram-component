import { computeCrossoutLine } from "./hints"

test("0 => _ _ _ => 0 (completed)", () => {
  expect(
    computeCrossoutLine(
      [0],
      [
        [4, "free"]
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 0,
        crossout: true
      }
    ],
    overflow: false,
    completed: true
  })
})

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
        [3, "free"]
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
        [1, "free"]
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

test("1 1 => _ _ x _ _ _ _ _ x _ _ _ _  => 1 1 (completed)", () => {
  expect(
    computeCrossoutLine(
      [1, 1],
      [
        [1, "free"],
        [1, "filled"],
        [3, "free"],
        [1, "filled"],
        [3, "free"]
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
        [3, "free"]
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
        [3, "free"]
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
        [3, "free"]
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
        [3, "free"]
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

// 1 _ 1 1 1
test("1 1 1 1 1 => x _ x x _ x x _ x _ x _ _   => 1 _ 1 1 _", () => {
  expect(
    computeCrossoutLine(
      [1, 1, 1, 1, 1],
      [
        [1, "filled"],
        [2, "filled"],
        [2, "filled"],
        [1, "filled"],
        [1, "filled"],
        [1, "free"]
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
        [1, "free"]
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
        [3, "filled"]
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
        [3, "filled"]
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
        [7, "filled"]
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

test("1 3 => _ _ x xxx => 1 3 (completed)", () => {
  expect(
    computeCrossoutLine(
      [1, 3],
      [
        [1, "free"],
        [1, "filled"],
        [3, "filled"]
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 3,
        crossout: true
      }
    ],
    overflow: false,
    completed: true
  })
})

test("2 2 => _ _ _ x _ xx =>  _ 2", () => {
  expect(
    computeCrossoutLine(
      [2, 2],
      [
        [2, "free"],
        [1, "filled"],
        [2, "filled"]
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 2,
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

test("7 2 4 1 => xxxxxxx _ _ _ _ x xxxx _ _ _ _ =>  7 _ 4 _", () => {
  expect(
    computeCrossoutLine(
      [7, 2, 4, 1],
      [
        [7, "filled"],
        [2, "free"],
        [1, "filled"],
        [4, "filled"],
        [3, "free"]
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
        hint: 4,
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

test("1 3 1 2 1 4 2 1 => x_xxx_x_xx____xxx_*_x_*x =>  1 3 1 2 _ _ _ 1 ", () => {
  expect(
    computeCrossoutLine(
      [1, 3, 1, 2, 1, 4, 2, 1],
      [
        [1, "filled"],
        [3, "filled"],
        [1, "filled"],
        [2, "filled"],
        [2, "free"],
        [3, "filled"],
        [1, "filled"],
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
        hint: 3,
        crossout: true
      },
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 2,
        crossout: true
      },
      {
        hint: 1,
        crossout: false
      },
      {
        hint: 4,
        crossout: false
      },
      {
        hint: 2,
        crossout: false
      },   
      {
        hint: 1,
        crossout: true
      },   
    ],
    overflow: false,
    completed: false
  })
})

test("1 1 3 2 4 2 2 => x_x_xxx_xx*___xx*_x_____ =>  1 1 3 2 _ _ _ ", () => {
  expect(
    computeCrossoutLine(
      [1, 1, 3, 2, 4, 2, 2],
      [
        [1, "filled"],
        [1, "filled"],
        [3, "filled"],
        [2, "filled"],
        [2, "free"],
        [2, "filled"],
        [1, "filled"],
        [4, "free"]
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
      },
      {
        hint: 3,
        crossout: true
      },
      {
        hint: 2,
        crossout: true
      },
      {
        hint: 4,
        crossout: false
      },
      {
        hint: 2,
        crossout: false
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


test("1 3 1 1 1 1 2 => x_xxx_x___x___x*__*__ =>  1 3 1 _ _ _ _ ", () => {
  expect(
    computeCrossoutLine(
      [1, 3, 1, 1, 1, 1, 2],
      [
        [1, "filled"],
        [3, "filled"],
        [1, "filled"],
        [1, "free"],
        [1, "filled"],
        [1, "free"],
        [1, "filled"],
        [2, "free"],
        [2, "free"]
      ]
    )
  ).toStrictEqual({
    line: [
      {
        hint: 1,
        crossout: true
      },
      {
        hint: 3,
        crossout: true
      },
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
        crossout: false
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