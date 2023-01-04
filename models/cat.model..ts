import { Cell } from "./cell.model";
import { Field } from "./field.model";

export class Cat {
  private cell: Cell;
  private field: Field;

  constructor(field: Field) {
    this.field = field;
    this.cell = this.field.getCell(
      Math.round(this.field.widht / 2),
      Math.round(this.field.height / 2 - 1)
    )!;
    this.cell.cat = this;
  }

  public move() {
    let [x, y] = this.getDirection();

    const nearestCells = this.getNearestCells();

    const nearestFreeCells = nearestCells.filter(
      (cell) => cell?.color === "green"
    );

    if (this.checkForLoose(x, y) || this.checkForWin(nearestFreeCells)) {
      window.location.reload();
    }

    let newCell = this.field.getCell(this.cell.x + x, this.cell.y + y);

    let attempts = 0;

    while (newCell?.color === "black") {
      newCell =
        nearestFreeCells[
          Math.round(Math.random() * (nearestFreeCells.length - 1))
        ];

      attempts++;
    }
    if (newCell) {
      this.cell.cat = null;
      this.cell = newCell;
      newCell.cat = this;
    }
  }

  private getDirection() {
    let dir: "x" | "y";

    let toFreeDistY = Math.abs(this.cell.y - this.field.height);
    let toFreeDistX = Math.abs(this.cell.x - this.field.widht);

    if (toFreeDistX < toFreeDistY) {
      dir = "x";
    } else {
      dir = "y";
    }

    const { half1, half2 } = this.countBlocks(this.field.cells, dir);

    if (toFreeDistX < toFreeDistY) {
      dir = "x";
    } else {
      dir = "y";
    }

    let mostBlockedHalf;
    if (dir === "x") {
      if (half1.count > half2.count) {
        const half = this.countBlocks(half1.cells, "y");

        if (half.half1.count > half.half2.count) {
          mostBlockedHalf = half.half1;
        } else {
          // 2

          mostBlockedHalf = half.half2;
        }
      } else {
        const half = this.countBlocks(half2.cells, "y");

        if (half.half1.count > half.half2.count) {
          mostBlockedHalf = half.half1;
        } else {
          mostBlockedHalf = half.half2;
        }
      }
    } else {
      if (half1.count > half2.count) {
        const half = this.countBlocks(half1.cells, "x");

        if (half.half1.count > half.half2.count) {
          mostBlockedHalf = half.half1;
        } else {
          mostBlockedHalf = half.half2;
        }
      } else {
        const half = this.countBlocks(half2.cells, "x");

        if (half.half1.count > half.half2.count) {
          mostBlockedHalf = half.half1;
        } else {
          mostBlockedHalf = half.half2;
        }
      }
    }
    const middleCell =
      mostBlockedHalf.cells[Math.floor(mostBlockedHalf.cells.length / 2)][
        Math.floor(
          mostBlockedHalf.cells[Math.floor(mostBlockedHalf.cells.length / 2)]
            .length / 2
        )
      ];

    const delta = {
      x: middleCell.x - this.cell.x,
      y: middleCell.y - this.cell.y,
    };

    let dirX = (delta.x / Math.abs(delta.x) || 0) * -1;
    let diry = (delta.y / Math.abs(delta.y) || 0) * -1;

    if (this.cell.y % 2 === 0) {
      dirX = dirX < 0 ? dirX + 1 : dirX;
    } else {
      dirX = dirX > 0 ? dirX - 1 : dirX;
    }

    return [dirX, diry];
  }

  private countBlocks(cells: Cell[][], dir: "x" | "y") {
    let half1: Cell[][] = [];
    let half2: Cell[][] = [];

    cells.forEach((row) => {
      let row1: Cell[] = [];
      let row2: Cell[] = [];

      row.forEach((cell) => {
        if (cell[dir] > this.cell[dir]) {
          row1.push(cell);
        } else {
          row2.push(cell);
        }
      });
      if (row1.length) {
        half1.push(row1);
      }
      if (row2.length) {
        half2.push(row2);
      }
    });

    const half1Blocks = half1.reduce((prev, curr) => {
      return (
        prev +
        curr.reduce((prev, curr) => {
          return prev + (curr.color === "black" ? 1 : 0);
        }, 0)
      );
    }, 0);

    const half2Blocks = half2.reduce((prev, curr) => {
      return (
        prev +
        curr.reduce((prev, curr) => {
          return prev + (curr.color === "black" ? 1 : 0);
        }, 0)
      );
    }, 0);

    return {
      half1: {
        cells: half1,
        count: half1Blocks,
      },
      half2: {
        cells: half2,
        count: half2Blocks,
      },
    };
  }

  getNearestCells() {
    const nearestCells: Cell[] = [];

    if (this.cell.y % 2 === 0) {
      nearestCells.push(this.field.getCell(this.cell.x + 1, this.cell.y)!);
      nearestCells.push(this.field.getCell(this.cell.x - 1, this.cell.y)!);
      nearestCells.push(this.field.getCell(this.cell.x + 1, this.cell.y + 1)!);
      nearestCells.push(this.field.getCell(this.cell.x + 1, this.cell.y - 1)!);
      nearestCells.push(this.field.getCell(this.cell.x, this.cell.y + 1)!);
      nearestCells.push(this.field.getCell(this.cell.x, this.cell.y - 1)!);
    } else {
      nearestCells.push(this.field.getCell(this.cell.x + 1, this.cell.y)!);
      nearestCells.push(this.field.getCell(this.cell.x - 1, this.cell.y)!);
      nearestCells.push(this.field.getCell(this.cell.x, this.cell.y + 1)!);
      nearestCells.push(this.field.getCell(this.cell.x, this.cell.y - 1)!);
      nearestCells.push(this.field.getCell(this.cell.x - 1, this.cell.y - 1)!);
      nearestCells.push(this.field.getCell(this.cell.x - 1, this.cell.y + 1)!);
    }

    return nearestCells;
  }

  checkForLoose(vectorX: number, vectorY: number) {
    if (
      this.cell.x + vectorX > this.field.widht - 1 ||
      this.cell.x + vectorX < 0 ||
      this.cell.y + vectorY > this.field.height - 1 ||
      this.cell.y + vectorY < 0
    ) {
      alert("looser");
      return true;
    }
  }

  checkForWin(nearestFreeCells: (Cell | null)[]) {
    if (nearestFreeCells.length <= 0) {
      alert("winer");
      return true;
    }
  }
}
