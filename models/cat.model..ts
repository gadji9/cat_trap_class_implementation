import { Cell } from "./cell.model";
import { Field } from "./field.model";

export class Cat {
  public cell: Cell;

  constructor(cell: Cell) {
    this.cell = cell;
    this.cell.cat = this;
  }
}
