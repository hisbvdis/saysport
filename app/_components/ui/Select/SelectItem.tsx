import clsx from "clsx";
import type { SelectItemProps } from ".";
// -----------------------------------------------------------------------------
import { MenuItem } from "@/app/_components/ui/Menu/";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectItem(props:SelectItemProps) {
  const { children, className, style, itemIndex } = props;

  return (
    <MenuItem
      className={clsx(styles["select__option"], className)}
      style={style}
      itemIndex={itemIndex}
    >
      {children}
    </MenuItem>
  )
}