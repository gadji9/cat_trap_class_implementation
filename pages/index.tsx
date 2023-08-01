import { useEffect, useState } from "react";
import { Field } from "../models/field.model";
import FieldComponent from "../components/field.component";

export default function Home() {
  const [field, setField] = useState<Field | undefined>();
  useEffect(() => {
    restart();
  }, []);

  function restart() {
    const newField = new Field();
      setField(newField);
  }

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <FieldComponent field={field} setField={setField} />
      </div>
    </>
  );
}