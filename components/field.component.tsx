import {
  Dispatch,
  Fragment,
  FunctionComponent,
  SetStateAction,
  use,
  useEffect,
} from "react";
import { Cell } from "../models/cell.model";
import { Field } from "../models/field.model";
import CellComponent from "./cell.component";

interface IFieldProps {
  field: Field;
  setField: Dispatch<SetStateAction<Field>>;
}

const FieldCompinent: FunctionComponent<IFieldProps> = ({
  field,
  setField,
}) => {
  function endTurn(cell: Cell) {
    field.endTurn(cell);

    updateField();
  }

  function updateField() {
    const newField = field.getCopyField();
    setField(newField);
  }

  return (
    <div>
      {field.cells.map((row, index) => (
        <Fragment key={index}>
          <div className={"flex " + (index % 2 === 0 ? "ml-[28px]" : "")}>
            {row.map((cell) => (
              <div key={cell.x.toString() + cell.y.toString()}>
                <CellComponent cell={cell} onClick={endTurn} />
              </div>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default FieldCompinent;
