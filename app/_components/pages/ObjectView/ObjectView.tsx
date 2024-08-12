"use client";
import clsx from "clsx";
import { createContext } from "react";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
import type { UIObject } from "@/app/_types/types";
// -----------------------------------------------------------------------------
import { Children, Contacts, Description, Header, Specs, Usages, Gallery } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ObjectView(props:{init:UIObject}) {
  return (
    <ObjectViewContext.Provider value={{state: props.init}}>
      <main className={clsx(styles["objectView"], "container", "page")}>
        <Header className={styles["objectView__header"]}/>
        <article className={styles["objectView__article"]}>
          <Gallery/>
          {props.init.description ? <Description/> : null}
          {props.init.type === objectTypeEnum.org ? <Children/> : null}
          {props.init.sections.filter((section) => section.section_type === sectionTypeEnum.usage).length ? <Usages/> : null}
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