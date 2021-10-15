function getRandom(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const getRandomRange = (seed: number) => {
  const random = getRandom(seed)
  return (lower: number, upper: number) => {
    return Math.floor(random() * Math.abs(upper - lower)) + lower
  }
}

export function shuffle(str: string) {
  const random = getRandomRange(str.length)
  const limit = str.length - 1
  const recipe: [number, number][] = Array(str.length)
    .fill(0)
    .map(() => [random(0, limit), random(0, limit)])

  const strArray = str.split("")
  recipe.forEach((r) => {
    const i1 = r[0]
    const i2 = r[1]
    ;[strArray[i1], strArray[i2]] = [strArray[i2], strArray[i1]]
  })

  return strArray.join("")
}

export function unshuffle(str: string) {
  const random = getRandomRange(str.length)
  const limit = str.length - 1
  const recipe: [number, number][] = Array(str.length)
    .fill(0)
    .map(() => [random(0, limit), random(0, limit)])

  const strArray = str.split("")
  recipe.reverse().forEach((r) => {
    const i1 = r[0]
    const i2 = r[1]
    ;[strArray[i1], strArray[i2]] = [strArray[i2], strArray[i1]]
  })

  return strArray.join("")
}
