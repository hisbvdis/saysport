import clsx from "clsx";
import type { MenuValueProps } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function MenuValue(props:MenuValueProps) {
  const { children, className, style } = props;

  return (
    <span className={clsx(styles["menu__value"], className)} style={style}>
      {children}
    </span>
  )
}