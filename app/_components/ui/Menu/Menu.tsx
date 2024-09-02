"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Menu(props:Props) {
  const { isShowMenu=false, value, onSelect, items } = props;
  const { className, style } = props;
  const [ focusIndex, setFocusIndex ] = useState(0);
  const itemsListRef = useRef<HTMLUListElement>(null);

  const handleDocumentKeydown = (e:KeyboardEvent) => {
    if (!["Escape", "ArrowUp", "ArrowDown", "Enter"].includes(e.code)) return;
    e.preventDefault();
    switch (e.code) {
      case "ArrowUp": {
        if (items?.length === 0 || focusIndex === 0) return;
        setFocusIndex(focusIndex - 1);
        focusItemByIndex(focusIndex - 1);
        break;
      }
      case "ArrowDown": {
        if (items?.length === 0 || items?.length && focusIndex === items?.length - 1) return;
        setFocusIndex(focusIndex + 1);
        focusItemByIndex(focusIndex + 1);
        break;
      }
      case "Enter": {
        if (onSelect) onSelect(focusIndex);
        break;
      }
    }
  }

  const focusItemByIndex = (index:number) => {
    if (!isShowMenu || !itemsListRef.current) return;
    const itemElem = itemsListRef.current.children[index] as HTMLLIElement;
    const itemRect = itemsListRef.current.children[index]?.getBoundingClientRect();
    const listRect = itemsListRef.current.getBoundingClientRect();
    if (itemRect?.top < listRect.top) itemsListRef.current.scrollTo({top: itemElem.offsetTop});
    if (itemRect?.bottom > listRect.bottom) itemsListRef.current.scrollTo({top: itemElem.offsetTop + itemRect.height - listRect.height});
  }

  const handlePointerDown = (e:React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerId !== 1) return;
    if (onSelect) onSelect(focusIndex);
  }

  useEffect(() => {
    if (!isShowMenu || !value || !items?.length) return;
    const itemIndex = items?.findIndex((item) => item.id === value);
    setFocusIndex(itemIndex);
    focusItemByIndex(itemIndex);
  }, [isShowMenu])

  useEffect(() => {
    if (isShowMenu) document.addEventListener("keydown", handleDocumentKeydown);
    return () => document.removeEventListener("keydown", handleDocumentKeydown);
  }, [isShowMenu, items, focusIndex]);

  useEffect(() => {
    setFocusIndex(items?.length && items.some((item) => item.id === value) ? items.findIndex((item) => item.id === value) : 0);
    // items?.length && focusItemByIndex(0);
  }, [items])

  if (!isShowMenu) return null;
  return (
    <ul className={clsx(styles["menu"], className)} style={style} ref={itemsListRef}>
      {items?.map((item, i) => (
        <li key={i} className={clsx(styles["menu__item"], i === focusIndex && styles["menu__item--focus"])} onPointerDown={handlePointerDown} onPointerEnter={() => setFocusIndex(i)}>
          {item.href ? <a className={styles["menu__link"]} href={item.href} style={{whiteSpace: "pre-wrap"}}>{item.label}</a> : <p className={styles["menu__link"]} style={{whiteSpace: "pre-wrap"}}>{item.label}</p>}
        </li>
      ))}
    </ul>
  )
}

interface Props {
  isShowMenu: boolean;
  items?: MenuItem[];
  value?: string | number;
  className?: string;
  style?: React.CSSProperties;
  onSelect?: (index:number) => void;
}

export interface MenuItem {
  id: string | number;
  label: string | null;
  href?:string;
}