import clsx from "clsx";
import { SelectContext, type SelectValueProps } from ".";
// -----------------------------------------------------------------------------
import { MenuItemText } from "@/app/_components/ui/Menu";
import { useContext } from "react";
// -----------------------------------------------------------------------------


export default function SelectValue(props:SelectValueProps) {
  const { children, className, style } = props;
  const { styles } = useContext(SelectContext);

  return (
    <MenuItemText className={clsx(styles["select__value"], className)} style={style}>
      {children}
    </MenuItemText>
  )
}