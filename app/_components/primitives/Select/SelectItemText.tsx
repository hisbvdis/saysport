import cx from "classix";
import { use } from "react";
import { SelectContext, type SelectItemTextProps } from ".";
// -----------------------------------------------------------------------------
import { MenuItemText } from "@/app/_components/primitives/Menu";
// -----------------------------------------------------------------------------


export default function SelectItemText(props:SelectItemTextProps) {
  const { children, className, style } = props;
  const { styles } = use(SelectContext);

  return (
    <MenuItemText className={cx(styles["select__value"], className)} style={style}>
      {children}
    </MenuItemText>
  )
}