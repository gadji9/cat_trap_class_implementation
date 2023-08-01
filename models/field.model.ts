import { makeAutoObservable } from "mobx";
import { Cat } from "./cat.model.";
import { Cell } from "./cell.model";

const enum Directions {
    LEFT = "left",
    RIGHT = "right",
    UP = "up",
    DOWN = "down",
}

export class Field {
    public cells: Cell[][] = [];
    public width: number = 11;
    public height: number = 11;
    public defaultBlocksCount: number = 15;
    private cat: Cat;

    constructor() {
        this.cells = [];

        let randomX = [];
        let randomY = [];

        const [middleX, middleY] = [
            Math.round(this.width / 2),
            Math.round(this.height / 2 - 1),
        ];

        for (let i = 0; i < Math.round(this.defaultBlocksCount); i++) {
            randomX.push(Math.floor(Math.random() * this.width));
        }
        for (let i = 0; i < Math.round(this.defaultBlocksCount); i++) {
            randomY.push(Math.floor(Math.random() * this.height));
        }

        for (let i = 0; i < this.height; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < this.width; j++) {
                row.push(new Cell("green", j, i));
            }
            this.cells.push(row);
        }

        for (let i = 0; i < this.defaultBlocksCount; ) {
            if (randomX[i] == middleX && randomY[i] == middleY) {
                break;
            }
            const cell = this.getCell(randomX[i], randomY[i]);
            if (cell) {
                cell.setColor("black");
                i++;
            }
        }
        const middleCell = this.getCell(middleX, middleY)!;
        middleCell.setColor("green");
        this.cat = new Cat(middleCell);

        makeAutoObservable(this);
    }

    setCells(cells: Cell[][]) {
        this.cells = cells;
    }

    setCat(cat: Cat) {
        this.cat = cat;
    }

    public getCopyField() {
        const newField = new Field();
        newField.setCells(this.cells);
        newField.setCat(this.cat);
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

        cell.setColor("black");

        // После каждого вашего хода, переместим кошку на одну ближайшую клетку к краю
        this.moveCat();
    }

    moveCat() {
        if (!this.cat) {
            return;
        }

        let pathToEdge = this.cat.path;

        if (!pathToEdge || this.checkIfPathHasBlackCell(pathToEdge)) {
            pathToEdge = this.findPathToEdge(this.cat.cell.x, this.cat.cell.y);
            this.cat.setPath(pathToEdge);
        }

        if (!pathToEdge) {
            const cells = this.getNearestCells();

            let randomNearestCell = cells[0];
            for (let index = 0; index < cells.length; index++) {
                const curCell = cells[index];

                if (curCell.color === "black") {
                    if (cells.length - 1 === index) {
                        this.win();
                        return;
                    }
                    continue;
                }

                randomNearestCell = curCell;
                break;
            }

            this.cat.cell.setCat(null);
            this.cat.setCell(randomNearestCell!);
            randomNearestCell!.setCat(this.cat);
            return;
        }

        const targetCell = this.cat.getNextStepPathCell(); // Второй элемент массива - это ближайшая свободная клетка к краю
        if (!targetCell) {
            this.loose();
        }

        // Перемещаем кошку
        this.cat.cell.setCat(null);
        this.cat.setCell(targetCell);
        targetCell.setCat(this.cat);
    }

    checkIfPathHasBlackCell(path: Cell[]) {
        return path.some((cell) => cell.color === "black");
    }

    findPathToEdge(startX: number, startY: number): Cell[] | null {
        const visited: Set<Cell> = new Set();
        const queue: { cell: Cell; path: Cell[] }[] = [];

        const startCell = this.getCell(startX, startY);
        queue.push({ cell: startCell!, path: [startCell!] });
        visited.add(startCell!);

        while (queue.length > 0) {
            const { cell, path } = queue.shift()!;

            // Проверяем, достигла ли кошка края поля
            if (this.isEdgeCell(cell)) {
                return path;
            }

            // Добавляем соседние свободные клетки в очередь для поиска
            const neighbors = this.getAvailableDirections(cell.x, cell.y).map(
                (dir) => this.getNewCoordinates(cell.x, cell.y, dir)
            );
            for (const [nx, ny] of neighbors) {
                const neighborCell = this.getCell(nx, ny);
                if (
                    neighborCell &&
                    neighborCell.color !== "black" &&
                    !visited.has(neighborCell)
                ) {
                    visited.add(neighborCell);
                    queue.push({
                        cell: neighborCell,
                        path: [...path, neighborCell],
                    });
                }
            }
        }

        return null;
    }

    getAvailableDirections(
        x: number,
        y: number
    ): ("left" | "right" | "up" | "down")[] {
        const availableDirections: ("left" | "right" | "up" | "down")[] = [];
        const directions: { dx: number; dy: number }[] = [
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 }, // right
            { dx: 0, dy: -1 }, // up
            { dx: 0, dy: 1 }, // down
        ];

        for (const dir of directions) {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            const cell = this.getCell(newX, newY);
            if (cell && cell.color !== "black") {
                availableDirections.push(this.getDirectionName(dir.dx, dir.dy));
            }
        }

        return availableDirections;
    }

    getNewCoordinates(
        x: number,
        y: number,
        direction: "left" | "right" | "up" | "down"
    ): [number, number] {
        const directions: Record<Directions, { dx: number; dy: number }> = {
            [Directions.LEFT]: { dx: -1, dy: 0 },
            right: { dx: 1, dy: 0 },
            up: { dx: 0, dy: -1 },
            down: { dx: 0, dy: 1 },
        };

        const { dx, dy } = directions[direction];
        return [x + dx, y + dy];
    }

    getDirectionName(dx: number, dy: number): "left" | "right" | "up" | "down" {
        if (dx === -1) return "left";
        if (dx === 1) return "right";
        if (dy === -1) return "up";
        if (dy === 1) return "down";
        throw new Error("Invalid direction");
    }

    isEdgeCell(cell: Cell): boolean {
        return (
            cell.x === 0 ||
            cell.x === this.width - 1 ||
            cell.y === 0 ||
            cell.y === this.height - 1
        );
    }

    getNearestCells() {
        const nearestCells: Cell[] = [];

        if (this.cat.cell.y % 2 === 0) {
            nearestCells.push(
                this.getCell(this.cat.cell.x + 1, this.cat.cell.y)!
            );
            nearestCells.push(
                this.getCell(this.cat.cell.x - 1, this.cat.cell.y)!
            );
            nearestCells.push(
                this.getCell(this.cat.cell.x + 1, this.cat.cell.y + 1)!
            );
            nearestCells.push(
                this.getCell(this.cat.cell.x + 1, this.cat.cell.y - 1)!
            );
            nearestCells.push(
                this.getCell(this.cat.cell.x, this.cat.cell.y + 1)!
            );
            nearestCells.push(
                this.getCell(this.cat.cell.x, this.cat.cell.y - 1)!
            );
        } else {
            nearestCells.push(
                this.getCell(this.cat.cell.x + 1, this.cat.cell.y)!
            );
            nearestCells.push(
                this.getCell(this.cat.cell.x - 1, this.cat.cell.y)!
            );
            nearestCells.push(
                this.getCell(this.cat.cell.x, this.cat.cell.y + 1)!
            );
            nearestCells.push(
                this.getCell(this.cat.cell.x, this.cat.cell.y - 1)!
            );
            nearestCells.push(
                this.getCell(this.cat.cell.x - 1, this.cat.cell.y - 1)!
            );
            nearestCells.push(
                this.getCell(this.cat.cell.x - 1, this.cat.cell.y + 1)!
            );
        }
        return nearestCells;
    }

    checkForLoose(vectorX: number, vectorY: number) {
        if (
            this.cat.cell.x + vectorX > this.width - 1 ||
            this.cat.cell.x + vectorX < 0 ||
            this.cat.cell.y + vectorY > this.height - 1 ||
            this.cat.cell.y + vectorY < 0
        ) {
            this.loose();
        }
    }

    checkForWin(nearestFreeCells: (Cell | null)[]) {
        if (nearestFreeCells.length <= 0) {
            this.win();
        }
    }

    loose() {
        alert("looser");
        window.location.reload();
    }

    win() {
        alert("winer");
        window.location.reload();
    }
}
