"use client";
import { UIObject } from "@/app/_types/types";
import clsx from "clsx";
import { createContext } from "react";
import { Children, Contacts, Description, Header, Sections } from "."
// -----------------------------------------------------------------------------


export default function ObjectView(props:{init:UIObject}) {
  return (
    <ObjectViewContext.Provider value={{state: props.init}}>
      <div className={clsx("container", "page")}>
        <Header/>
        <article>
          <Description/>
          <Children/>
          <Sections/>
        </article>
        <aside>
          <Contacts/>
        </aside>
      </div>
    </ObjectViewContext.Provider>
  )
}

export const ObjectViewContext = createContext<ObjectViewContextType>({} as ObjectViewContextType)

interface ObjectViewContextType {
  state: UIObject;
}