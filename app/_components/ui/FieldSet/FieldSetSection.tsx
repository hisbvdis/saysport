import cx from "classix";
// -----------------------------------------------------------------------------
import type { FieldSetSectionProps } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function FieldSetSection(props:FieldSetSectionProps) {
  const { children, className, style } = props;

  return (
    <div className={cx(styles["fieldset__section"], className)} style={style}>
      {children}
    </div>
  )
}