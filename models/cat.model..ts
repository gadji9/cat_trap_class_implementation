import { makeAutoObservable } from "mobx";
import { Cell } from "./cell.model";

export class Cat {
  public cell: Cell;

  constructor(cell: Cell) {
    this.cell = cell;
    this.cell.cat = this;
    makeAutoObservable(this);
  }

  setCell(cell: Cell) {
    this.cell = cell
  }
}