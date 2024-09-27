import clsx from "clsx";
import type { SelectValueProps } from ".";
// -----------------------------------------------------------------------------
import { MenuItem } from "../Menu";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectValue(props:SelectValueProps) {
  const { children, className, style } = props;

  return (
    <MenuItem.Value className={clsx(styles["select__value"], className)} style={style}>
      {children}
    </MenuItem.Value>
  )
}