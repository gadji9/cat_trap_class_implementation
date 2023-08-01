import { makeAutoObservable } from "mobx";
import { Cell } from "./cell.model";

export class Cat {
    public cell: Cell;
    public path: Cell[] | null = null;
    private step: number = 1;

    constructor(cell: Cell) {
        this.cell = cell;
        this.cell.cat = this;
        makeAutoObservable(this);
    }

    getNextStepPathCell() {
        const path = this.path || [];

        return path[this.step];
    }

    setCell(cell: Cell) {
        this.cell = cell;
        this.step += 1;
    }

    setPath(path: Cell[] | null) {
        this.path = path;
        this.step = 1;
    }
}
