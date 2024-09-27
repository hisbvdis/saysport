import clsx from "clsx";
import type { SelectOptionProps } from ".";
// -----------------------------------------------------------------------------
import { MenuItem } from "../Menu";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectOption(props:SelectOptionProps) {
  const { children, className, style } = props;

  return (
    <MenuItem className={clsx(styles["select__option"], className)} style={style}>
      {children}
    </MenuItem>
  )
}