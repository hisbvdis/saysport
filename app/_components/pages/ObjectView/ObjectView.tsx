"use client";
import clsx from "clsx";
import { createContext } from "react";
import type { Session } from "next-auth";
import { objectTypeEnum } from "@/drizzle/schema";
import type { ProcObject } from "@/app/_types/types";
// -----------------------------------------------------------------------------
import { Children, Contacts, Description, Header, Sections, Usages, Gallery } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ObjectView(props:{init:ProcObject, session:Session|null}) {
  return (
    <ObjectViewContext.Provider value={{state: props.init, session: props.session}}>
      <main className={clsx(styles["objectView"], "container", "page")}>
        <Header className={styles["objectView__header"]}/>
        <article className={styles["objectView__article"]}>
          <Gallery/>
          {props.init.description ? <Description/> : null}
          {props.init.type === objectTypeEnum.org ? <Children/> : null}
          {props.init.type !== objectTypeEnum.org ? <Usages/> : null}
          <Sections/>
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
  state: ProcObject;
  session:Session|null;
}