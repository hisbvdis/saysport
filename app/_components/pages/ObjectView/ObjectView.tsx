"use client";
import clsx from "clsx";
import { createContext } from "react";
// -----------------------------------------------------------------------------
import Gallery from "./Gallery/Gallery";
import { Children, Contacts, Description, Header, Specs } from ".";
// -----------------------------------------------------------------------------
import { UIObject } from "@/app/_types/types";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ObjectView(props:{init:UIObject}) {
  return (
    <ObjectViewContext.Provider value={{state: props.init}}>
      <main className={clsx(styles["objectView"], "container", "page")}>
        <Header className={styles["objectView__header"]}/>
        <article className={styles["objectView__article"]}>
          <Gallery/>
          <Description/>
          <Children/>
          <Specs/>
        </article>
        <aside className={styles["objectView__aside"]}>
          <Contacts/>
        </aside>
      </main>
    </ObjectViewContext.Provider>
  )
}

export const ObjectViewContext = createContext<ObjectViewContextType>({} as ObjectViewContextType)

interface ObjectViewContextType {
  state: UIObject;
}