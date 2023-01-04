import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Field } from "../models/field.model";
import FieldComponent from "../components/field.component";

export default function Home() {
  const [field, setField] = useState(new Field());

  useEffect(() => {
    restart();
  }, []);

  function restart() {
    const newField = new Field();
    newField.init();
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

/**
 * board : {
 *  cell: {
 *    color: 'blue' | 'green' | 'black' | 'white'
 *    coords: Array<string>
 *    figure: {
 *      name: strig,
 *
 * }
 *  }[][]
 *  cellsHeight: 8
 *  cellsWidth: 8
 *  theme: green, black-white
 *  currentFigure: Figure
 * }
 *
 *
 *
 *
 *
 *
 */
