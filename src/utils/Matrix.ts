export interface CellLocation {
  index: number
  row: number
  col: number
}

export class Matrix<T> {
  constructor(
    private readonly _values: T[],
    public readonly metaMatrix: MetaMatrix
  ) {}

  public setAt(index: number, newValue: T): Matrix<T> {
    const newMatrix = this.clone()
    newMatrix._values[index] = newValue

    return newMatrix
  }

  public get(row: number, col: number): T {
    const i = row * this.metaMatrix.cols + col
    return this.at(i)
  }

  public at(i: number): T {
    return this._values[i]
  }

  public getRow(i: number): T[] {
    return this.metaMatrix.row(i).map(location => this.at(location.index))
  }

  public getRows(): T[][] {
    return Array.from(Array(this.metaMatrix.rows).keys()).map((i) => this.getRow(i))
  }
  
  public getCol(i: number): T[] {
    return this.metaMatrix.col(i).map(location => this.at(location.index))
  }

  public getCols(): T[][] {
    return Array.from(Array(this.metaMatrix.cols).keys()).map((i) => this.getCol(i))
  }

  public clone() {
    return new Matrix(this.values, this.metaMatrix)
  }

  public get values() {
    return [...this._values]
  }

  public equals(matrix: Matrix<T>): boolean {
    if (!matrix.metaMatrix.equals(this.metaMatrix)) {
      return false
    }

    const indices = this.metaMatrix.all().map((loc) => loc.index)
    return indices.every((index) => matrix.at(index) === this.at(index))
  }

  static init<T>(metaMatrix: MetaMatrix, value: T): Matrix<T> {
    return new Matrix(
      Array(metaMatrix.rows * metaMatrix.cols).fill(value),
      metaMatrix
    )
  }

  public toString() {
    return `${this.metaMatrix.cols}${this.metaMatrix.rows}${this._values.join(
      ''
    )}`
  }
}
 
export type MatrixLine = CellLocation[]

export class MetaMatrix {
  constructor(public readonly rows: number, public readonly cols: number) {}

  public index(i: number): CellLocation {
    return {
      index: i,
      row: Math.floor(i / this.rows),
      col: i % this.cols
    }
  }

  public all(): CellLocation[] {
    return Array.from(Array(this.rows * this.cols).keys()).map((i) =>
      this.index(i)
    )
  }

  public col(c: number): MatrixLine {
    return Array.from(Array(this.rows).keys()).map((i) => this.index(c + this.cols * i))
  }

  public row(r: number): MatrixLine {
    return Array.from(Array(this.cols).keys()).map((i) => this.index(i + this.cols * r))
  }

  public allRows(): MatrixLine[] {
    return Array.from(Array(this.rows).keys()).map((i) => this.row(i))
  }

  public equals(metaMatrix: MetaMatrix): boolean {
    return metaMatrix.cols === this.cols && metaMatrix.rows === this.rows
  }
}
