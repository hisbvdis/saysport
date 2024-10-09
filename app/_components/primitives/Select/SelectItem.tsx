import cx from "classix";
import { use } from "react";
// -----------------------------------------------------------------------------
import { SelectContext, type SelectItemProps } from ".";
import { MenuItem } from "@/app/_components/primitives//Menu/";
// -----------------------------------------------------------------------------


export default function SelectItem(props:SelectItemProps) {
  const { children, className, style, itemIndex } = props;
  const { styles } = use(SelectContext);

  return (
    <MenuItem
      className={cx(styles["select__item"], className)}
      style={style}
      itemIndex={itemIndex}
    >
      {children}
    </MenuItem>
  )
}