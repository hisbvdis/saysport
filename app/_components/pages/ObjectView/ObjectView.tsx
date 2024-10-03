"use client";
import cx from "classix";
import { createContext } from "react";
import { objectTypeEnum } from "@/drizzle/schema";
import type { ProcessedDBObject } from "@/app/_types/db";
// -----------------------------------------------------------------------------
import { Children, Contacts, Description, Gallery, Header, Sections, Usages } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ObjectView(props:{init:ProcessedDBObject; isLogin:boolean}) {
  return (
    <ObjectViewContext.Provider value={{state: props.init, isLogin: props.isLogin}}>
      <div className={cx(styles["objectView"], "container", "page")}>
        <Header className={styles["objectView__header"]}/>
        <main className={styles["objectView__main"]}>
          <Gallery/>
          {props.init.description ? <Description/> : null}
          {props.init.type === objectTypeEnum.org ? <Children/> : null}
          {props.init.type !== objectTypeEnum.org ? <Usages/> : null}
          <Sections/>
        </main>
        <aside className={styles["objectView__aside"]}>
          <Contacts/>
        </aside>
      </div>
    </ObjectViewContext.Provider>
  )
}

export const ObjectViewContext = createContext<ObjectViewContextType>({} as ObjectViewContextType)

interface ObjectViewContextType {
  state: ProcessedDBObject;
  isLogin: boolean;
}