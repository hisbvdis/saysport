import clsx from "clsx";
// -----------------------------------------------------------------------------
import type { ControlSectionProps } from "./";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ControlSection(props:ControlSectionProps) {
  const { children, className, style } = props;

  return (
    <div className={clsx(styles["control__section"], className)} style={style}>
      {children}
    </div>
  )
}