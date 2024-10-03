import cx from "classix";
// -----------------------------------------------------------------------------
import type { ControlSectionProps } from "./";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ControlSection(props:ControlSectionProps) {
  const { children, className, style } = props;

  return (
    <div className={cx(styles["control__section"], className)} style={style}>
      {children}
    </div>
  )
}