import clsx from "clsx";
// -----------------------------------------------------------------------------
import MenuValue from "./MenuValue";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function MenuItem(props:MenuItemProps) {
  const { children, className, style } = props;

  return (
    <button className={clsx(styles["menu__item"], className)} type="button" style={style}>
      {children}
    </button>
  )
}

MenuItem.Value = MenuValue;

interface MenuItemProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}