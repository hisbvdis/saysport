import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { MenuItem } from "@/app/_components/ui/Menu/";
import { SelectContext, type SelectItemProps } from ".";
// -----------------------------------------------------------------------------


export default function SelectItem(props:SelectItemProps) {
  const { children, className, style, itemIndex } = props;
  const { styles } = useContext(SelectContext);

  return (
    <MenuItem
      className={clsx(styles["selectItem"], className)}
      style={style}
      itemIndex={itemIndex}
    >
      {children}
    </MenuItem>
  )
}