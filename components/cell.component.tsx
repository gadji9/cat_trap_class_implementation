import { FunctionComponent } from "react";
import { Cell } from "../models/cell.model";
import Image from "next/image";

const CellComponent: FunctionComponent<{
  cell: Cell;
  onClick: (cell: Cell) => void;
}> = ({ cell, onClick }) => {
  return (
    <div
      className={"ml-[5px] -mt-[20px] relative"}
      onClick={() => onClick(cell)}
    >
      <div
        className={
          "flex flex-col hexa " +
          (cell.color === "green" && !cell.cat ? "hover:opacity-60" : "")
        }
      >
        {cell.cat && (
          <img
            className="absolute "
            src="https://i.ibb.co/zF5WdBt/cat.png"
            alt="s"
            width={50}
            height={50}
          />
        )}
        <div
          className={`hexagon hexagon_${cell.color} hexagon_zero hexagon_triangle_up hexagon_triangle_up_large`}
        ></div>
        <div className={`inside_${cell.color}`}></div>
        <div
          className={`hexagon hexagon_${cell.color} hexagon_zero hexagon_triangle_down hexagon_triangle_down_large`}
        ></div>
      </div>
    </div>
  );
};

export default CellComponent;
