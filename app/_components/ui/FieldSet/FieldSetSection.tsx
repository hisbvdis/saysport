import clsx from "clsx";
// -----------------------------------------------------------------------------
import type { FieldSetSectionProps } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function FieldSetSection(props:FieldSetSectionProps) {
  const { children, className, style } = props;

  return (
    <div className={clsx(styles["fieldset__section"], className)} style={style}>
      {children}
    </div>
  )
}