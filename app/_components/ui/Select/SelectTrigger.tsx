"use client";
import clsx from "clsx";
import styles from "./styles.module.css";
// -----------------------------------------------------------------------------
import SelectInput from "./SelectInput";
import SelectArrowIcon from "./SelectArrowIcon";
import SelectCloseButton from "./SelectCloseButton";
// -----------------------------------------------------------------------------
import type { SelectTriggerProps } from "./SelectTypes";


export default function SelectTrigger(props:SelectTriggerProps) {
  const { children, className, style } = props;

  return (<>
    <div className={clsx(styles["select__trigger"], className)} style={style}>
      {children}
    </div>
  </>)
}

SelectTrigger.Input = SelectInput;
SelectTrigger.ArrowIcon = SelectArrowIcon;
SelectTrigger.CloseButton = SelectCloseButton;