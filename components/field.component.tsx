import { observer } from "mobx-react-lite";

import {
  Dispatch,
  Fragment,
  FunctionComponent,
  SetStateAction,
  useState,
} from "react";
import { Cell } from "../models/cell.model";
import { Field } from "../models/field.model";
import CellComponent from "./cell.component";

interface IFieldProps {
  field: Field | undefined;
  setField: Dispatch<SetStateAction<Field | undefined>>;
}

const FieldCompinent: FunctionComponent<IFieldProps> = ({
  field,
  setField,
}) => {

  function endTurn(cell: Cell) {
    field?.endTurn(cell);
  }



  return (
    <div>
      {field?.cells?.map((row, index) => (
        <Fragment key={index}>
          <div className={"flex " + (index % 2 === 0 ? "ml-[28px]" : "")}>
            {row?.map((cell) => (
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

export default observer(FieldCompinent);
