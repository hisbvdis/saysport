import clsx from "clsx";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function MenuRoot(props:MenuRootProps) {
  const { children, className, style } = props;

  return (
    <div className={clsx(styles["menu"], className)} style={style}>
      {children}
    </div>
  )
}

export interface MenuRootProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

interface MenuItem {
  id: string;
  label: string;
}