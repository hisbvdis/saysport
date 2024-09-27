import clsx from "clsx";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectTrigger(props:SelectTriggerProps) {
  const { children, className, style } = props;

  return (<>
    <div className={clsx(styles["select__trigger"], className)} style={style}>
      {children}
    </div>
  </>)
}

export interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}