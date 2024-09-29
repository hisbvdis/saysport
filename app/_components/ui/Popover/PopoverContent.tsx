import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { PopoverContext } from "./PopoverRoot";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";
import type { PopoverContentProps } from ".";


export default function PopoverContent(props:PopoverContentProps) {
  const { className, children, style } = props;
  const { dialogContentRef } = useContext(PopoverContext);

  return (
    <div className={clsx(styles["popover__content"], className)} style={style} ref={dialogContentRef}>
      {children}
    </div>
  )
}