"use client";
import clsx from "clsx";
import { useContext } from "react";
import type { SelectArrowIconProps } from "./SelectTypes";
// -----------------------------------------------------------------------------
import { SelectContext } from "./SelectRoot";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectArrowIcon(props:SelectArrowIconProps) {
  const { children, className, style } = props;
  const { isAutocomplete } = useContext(SelectContext);

  if (isAutocomplete) return null;
  return (
    <span
      className={clsx(styles["select__arrowIcon"], className)}
      style={style}
    >
      {children}
    </span>
  )
}