import cx from "classix";
// -----------------------------------------------------------------------------
import type { MenuItemTextProps } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function MenuItemText(props:MenuItemTextProps) {
  const { children, className, style } = props;

  return (
    <span className={cx(styles["menu__value"], className)} style={style}>
      {children}
    </span>
  )
}