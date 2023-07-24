import { Cat } from "./cat.model.";
import { Cell } from "./cell.model";

export class Field {
  public cells: Cell[][] = [];
  public widht: number = 11;
  public height: number = 11;
  public defaultBlocksCount: number = 15;
  private cat: Cat;


  constructor() {
    this.cells = [];
    

    let randomX = [];
    let randomY = [];

    const [middleX, middleY] = [Math.round(this.widht / 2), Math.round(this.height / 2 - 1)]
    
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
      if(randomX[i] == middleX && randomY[i] == middleY ) {
          break
      }
      const cell = this.getCell(randomX[i], randomY[i]);
      if (cell) {
          cell.color = "black";
          i++;
      }
    }
    const middleCell = this.getCell(middleX, middleY)!
    middleCell.color="green"
    this.cat = new Cat(
      middleCell
    );
    
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

    this.moveCat();
  }

  public moveCat() {
    if (!this.cat) {
      return;
    }
    let [x, y] = this.getDirection();

    const nearestCells = this.getNearestCells();

    const nearestFreeCells = nearestCells.filter(
      (cell) => cell?.color === "green"
    );

    if (this.checkForLoose(x, y) || this.checkForWin(nearestFreeCells)) {
      window.location.reload();
    }

    let newCell = this.getCell(this.cat.cell.x + x, this.cat.cell.y + y);

    while (newCell?.color === "black") {
      newCell =
        nearestFreeCells[
          Math.round(Math.random() * (nearestFreeCells.length - 1))
        ];
    }
    if (newCell) {
      this.cat.cell.cat = null;
      this.cat.cell = newCell;
      newCell.cat = this.cat;
    }
  }

  private getDirection() {
    let dir: "x" | "y";

    let toFreeDistY = Math.abs(this.cat.cell.y - this.height);
    let toFreeDistX = Math.abs(this.cat.cell.x - this.widht);

    if (toFreeDistX < toFreeDistY) {
      dir = "x";
    } else {
      dir = "y";
    }

    const { half1, half2 } = this.countBlocks(this.cells, dir);

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
      x: middleCell.x - this.cat.cell.x,
      y: middleCell.y - this.cat.cell.y,
    };

    let dirX = (delta.x / Math.abs(delta.x) || 0) * -1;
    let diry = (delta.y / Math.abs(delta.y) || 0) * -1;

    if (this.cat.cell.y % 2 === 0) {
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
        if (cell[dir] > this.cat.cell[dir]) {
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

    if (this.cat.cell.y % 2 === 0) {
      nearestCells.push(this.getCell(this.cat.cell.x + 1, this.cat.cell.y)!);
      nearestCells.push(this.getCell(this.cat.cell.x - 1, this.cat.cell.y)!);
      nearestCells.push(this.getCell(this.cat.cell.x + 1, this.cat.cell.y + 1)!);
      nearestCells.push(this.getCell(this.cat.cell.x + 1, this.cat.cell.y - 1)!);
      nearestCells.push(this.getCell(this.cat.cell.x, this.cat.cell.y + 1)!);
      nearestCells.push(this.getCell(this.cat.cell.x, this.cat.cell.y - 1)!);
    } else {
      nearestCells.push(this.getCell(this.cat.cell.x + 1, this.cat.cell.y)!);
      nearestCells.push(this.getCell(this.cat.cell.x - 1, this.cat.cell.y)!);
      nearestCells.push(this.getCell(this.cat.cell.x, this.cat.cell.y + 1)!);
      nearestCells.push(this.getCell(this.cat.cell.x, this.cat.cell.y - 1)!);
      nearestCells.push(this.getCell(this.cat.cell.x - 1, this.cat.cell.y - 1)!);
      nearestCells.push(this.getCell(this.cat.cell.x - 1, this.cat.cell.y + 1)!);
    }
    return nearestCells;
  }

  checkForLoose(vectorX: number, vectorY: number) {
    if (
      this.cat.cell.x + vectorX > this.widht - 1 ||
      this.cat.cell.x + vectorX < 0 ||
      this.cat.cell.y + vectorY > this.height - 1 ||
      this.cat.cell.y + vectorY < 0
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
