"use client";
import clsx from "clsx";
import { useContext } from "react";
import type { SelectCloseButtonProps } from "./SelectTypes";
// -----------------------------------------------------------------------------
import { SelectContext } from "./SelectRoot";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectCloseButton(props:SelectCloseButtonProps) {
  const { children, className, style } = props;
  const { isAutocomplete, selectedItem, handleClearBtnClick, disabled } = useContext(SelectContext);

  if (!isAutocomplete || !selectedItem?.id) return null;
  return (
    <button
      className={clsx(styles["select__closeButton"], className)}
      type="button"
      style={style}
      onClick={handleClearBtnClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}