"use client";
import cx from "classix";
import { createContext, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import type { MenuContextType, MenuRootProps } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function MenuRoot(props:MenuRootProps) {
  const { children, className, style, items, value, onSelect, close } = props;
  const menuRef = useRef<HTMLDivElement>(null);
  const [ focusedItemIndex, setFocusedItemIndex ] = useState(0);

  const handleDocumentKeydown = (e:KeyboardEvent) => {
    if (!["ArrowUp", "ArrowDown", "Enter"].includes(e.code)) return;
    e.preventDefault();
    switch (e.code) {
      case "ArrowUp": {
        if (!items.length || focusedItemIndex === 0) return;
        setFocusedItemIndex(focusedItemIndex - 1);
        focusItemByIndex(focusedItemIndex - 1);
        break;
      }
      case "ArrowDown": {
        if (!items.length || focusedItemIndex === items.length - 1) return;
        setFocusedItemIndex(focusedItemIndex + 1);
        focusItemByIndex(focusedItemIndex + 1);
        break;
      }
      case "Enter": {
        selectFocusedItem();
        break;
      }
    }
  }

  const selectFocusedItem = () => {
    onSelect(items[focusedItemIndex].id);
    if (close) close();
  }

  const focusItemByIndex = (index:number) => {
    if (!menuRef.current) return;
    const menuRect = menuRef.current.getBoundingClientRect();
    const itemElem = menuRef.current.children[index] as HTMLLIElement;
    if (!itemElem) return;
    const itemRect = itemElem.getBoundingClientRect();
    if (itemRect?.top < menuRect.top) menuRef.current.scrollTo({top: itemElem.offsetTop});
    if (itemRect?.bottom > menuRect.bottom) menuRef.current.scrollTo({top: itemElem.offsetTop + itemRect.height - menuRect.height});
  }

  useEffect(() => {
    if (!value || !items.length) return;
    const selectedItemIndex = items?.findIndex((item) => item.id === value);
    setFocusedItemIndex(selectedItemIndex);
    focusItemByIndex(selectedItemIndex);
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleDocumentKeydown);
    return () => document.removeEventListener("keydown", handleDocumentKeydown);
  }, [focusedItemIndex, items])

  useEffect(() => {
    setFocusedItemIndex(items.length && items.some((item) => item.id === value) ? items.findIndex((item) => item.id === value) : 0);
  }, [items])

  return (
    <MenuContext.Provider value={{ focusedItemIndex, setFocusedItemIndex, items, selectFocusedItem, styles }}>
      <menu className={cx(styles["menu__root"], className)} style={style} ref={menuRef}>
        {children}
      </menu>
    </MenuContext.Provider>
  )
}

export const MenuContext = createContext<MenuContextType>({} as MenuContextType);