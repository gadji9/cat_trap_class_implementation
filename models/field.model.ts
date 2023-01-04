import { turn } from "../types/colors";
import { Cat } from "./cat.model.";
import { Cell } from "./cell.model";

export class Field {
  public cells: Cell[][] = [];
  public widht: number = 11;
  public height: number = 11;
  public defaultBlocksCount: number = 15;
  private cat: Cat | null = null;

  public init() {
    this.cells = [];
    this.cat = null;

    let randomX = [];
    let randomY = [];

    for (let i = 0; i < Math.round(this.defaultBlocksCount); i++) {
      randomX.push(Math.floor(Math.random() * this.widht));
    }
    for (let i = 0; i < Math.round(this.defaultBlocksCount); i++) {
      randomY.push(Math.floor(Math.random() * this.height));
    }

    for (let i = 0; i < this.height; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < this.widht; j++) {
        row.push(new Cell("green", j, i));
      }
      this.cells.push(row);
    }

    for (let i = 0; i < this.defaultBlocksCount; ) {
      const cell = this.getCell(randomX[i], randomY[i]);
      if (cell) {
        if (!cell.cat) {
          cell.color = "black";
          i++;
        }
      }
    }

    this.cat = new Cat(this);
  }

  public getCopyField() {
    const newField = new Field();
    newField.cells = this.cells;
    newField.cat = this.cat;
    return newField;
  }
  public getCell(x: number, y: number) {
    if (this.cells[y]) {
      return this.cells[y][x];
    }
    return null;
  }

  public endTurn(cell: Cell) {
    if (cell.cat || cell.color === "black") {
      return;
    }

    cell.color = "black";

    this.cat?.move();
  }
}
