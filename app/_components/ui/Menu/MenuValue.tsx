import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { MenuContext, type MenuItemTextProps } from ".";


export default function MenuItemText(props:MenuItemTextProps) {
  const { children, className, style } = props;
  const { styles } = useContext(MenuContext);

  return (
    <span className={clsx(styles["menu__value"], className)} style={style}>
      {children}
    </span>
  )
}