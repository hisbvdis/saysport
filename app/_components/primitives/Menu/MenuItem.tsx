import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { MenuContext, type MenuItemProps } from "."
// -----------------------------------------------------------------------------


export default function MenuItem(props:MenuItemProps) {
  const { children, className, style, itemIndex } = props;
  const { focusedItemIndex, setFocusedItemIndex, selectFocusedItem, styles } = useContext(MenuContext);

  return (
    <li className={styles["menu__item"]}>
      <button
        type="button"
        className={clsx(styles["menu__itemButton"], itemIndex === focusedItemIndex && styles["menu__itemButton--focus"], className)}
        style={style}
        onPointerMove={() => setFocusedItemIndex(itemIndex)}
        onClick={() => selectFocusedItem()}
      >
        {children}
      </button>
    </li>
  )
}