"use client";
import { useEffect, useState } from "react";
import type { MenuItem } from "../Menu/Menu";
// -----------------------------------------------------------------------------
import { Menu } from "../Menu";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";
import { ArrowDownIcon } from "../Select";


export default function Dropdown(props:Props) {
  const { items } = props;
  const { children, style } = props;
  const [ isShowMenu, setIsShowMenu ] = useState(false);

  const handleDocumentMousedown = (e:MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles["dropdown"]}`)) return;
    setIsShowMenu(false);
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentMousedown);
    return () => document.removeEventListener("mousedown", handleDocumentMousedown);
  })

  return (
    <div className={styles["dropdown"]} style={style}>
      <button type="button" className={styles["dropdown__button"]} onClick={() => setIsShowMenu(!isShowMenu)}>ещё {items.length}</button>
      <ArrowDownIcon/>
      <Menu
        isShowMenu={isShowMenu}
        items={items}
      />
    </div>
  )
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  items: MenuItem[];
}