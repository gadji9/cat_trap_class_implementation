import { colors } from "../types/colors";
import { Cat } from "./cat.model.";

export class Cell {
  public cat: Cat | null = null;
  public color: colors;
  public x: number;
  public y: number;

  constructor(color: colors, x: number, y: number) {
    this.color = color;
    this.x = x;
    this.y = y;
  }
}
