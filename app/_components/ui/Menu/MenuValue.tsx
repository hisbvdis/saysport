import clsx from "clsx";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function MenuValue(props:MenuValueProps) {
  const { children, className, style } = props;

  return (
    <span className={clsx(styles["menu__value"], className)} style={style}>
      {children}
    </span>
  )
}

interface MenuValueProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}