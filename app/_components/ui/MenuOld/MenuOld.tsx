"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function MenuOld(props:Props) {
  const { isShowMenu=false, value, onSelect, items } = props;
  const { className, style } = props;
  /* [V] */const [ focusIndex, setFocusIndex ] = useState(0);
  const itemsListRef = useRef<HTMLUListElement>(null);

  /* [V] */const handleDocumentKeydown = (e:KeyboardEvent) => {
  /* [V] */  if (!["Escape", "ArrowUp", "ArrowDown", "Enter"].includes(e.code)) return;
  /* [V] */  e.preventDefault();
  /* [V] */  switch (e.code) {
  /* [V] */    case "ArrowUp": {
  /* [V] */      if (items?.length === 0 || focusIndex === 0) return;
  /* [V] */      setFocusIndex(focusIndex - 1);
  /* [V] */      focusItemByIndex(focusIndex - 1);
  /* [V] */      break;
  /* [V] */    }
  /* [V] */    case "ArrowDown": {
  /* [V] */      if (items?.length === 0 || items?.length && focusIndex === items?.length - 1) return;
  /* [V] */      setFocusIndex(focusIndex + 1);
  /* [V] */      focusItemByIndex(focusIndex + 1);
  /* [V] */      break;
  /* [V] */    }
  /* [V] */    case "Enter": {
  /* [V] */      if (onSelect) onSelect(focusIndex);
  /* [V] */      break;
  /* [V] */    }
  /* [V] */  }
  /* [V] */}

  /* [V] */const focusItemByIndex = (index:number) => {
  /* [V] */  if (!isShowMenu || !itemsListRef.current) return;
  /* [V] */  const itemElem = itemsListRef.current.children[index] as HTMLLIElement;
  /* [V] */  const itemRect = itemsListRef.current.children[index]?.getBoundingClientRect();
  /* [V] */  const listRect = itemsListRef.current.getBoundingClientRect();
  /* [V] */  if (itemRect?.top < listRect.top) itemsListRef.current.scrollTo({top: itemElem.offsetTop});
  /* [V] */  if (itemRect?.bottom > listRect.bottom) itemsListRef.current.scrollTo({top: itemElem.offsetTop + itemRect.height - listRect.height});
  /* [V] */}

  /* [V] */const handlePointerDown = (e:React.PointerEvent<HTMLLIElement>) => {
  /* [V] */  if (e.pointerType === "mouse" && e.pointerId !== 1) return;
  /* [V] */  if (onSelect) onSelect(focusIndex);
  /* [V] */}

  /* [V] */useEffect(() => {
  /* [V] */  if (!isShowMenu || !value || !items?.length) return;
  /* [V] */  const itemIndex = items?.findIndex((item) => item.id === value);
  /* [V] */  setFocusIndex(itemIndex);
  /* [V] */  focusItemByIndex(itemIndex);
  /* [V] */}, [isShowMenu])

  /* [V] */useEffect(() => {
  /* [V] */  if (isShowMenu) document.addEventListener("keydown", handleDocumentKeydown);
  /* [V] */  return () => document.removeEventListener("keydown", handleDocumentKeydown);
  /* [V] */}, [isShowMenu, items, focusIndex]);

  /* [V] */useEffect(() => {
  /* [V] */  setFocusIndex(items?.length && items.some((item) => item.id === value) ? items.findIndex((item) => item.id === value) : 0);
  /* [V] */  // items?.length && focusItemByIndex(0);
  /* [V] */}, [items])

  if (!isShowMenu) return null;
  return (
    <ul className={clsx(styles["menu"], className)} style={style} ref={itemsListRef}>
      {items?.map((item, i) => (
        <li key={i} className={clsx(styles["menu__item"], i === focusIndex && styles["menu__item--focus"])} onPointerDown={handlePointerDown} onPointerEnter={() => setFocusIndex(i)}>
          <p className={styles["menu__link"]} style={{whiteSpace: "pre-wrap"}}>{item.label}</p>
        </li>
      ))}
    </ul>
  )
}

interface Props {
  isShowMenu: boolean;
  items?: {id: number|string, label: string|null}[];
  value?: string | number;
  className?: string;
  style?: React.CSSProperties;
  onSelect?: (index:number) => void;
}