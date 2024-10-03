import cx from "classix";
import { useContext } from "react"
// -----------------------------------------------------------------------------
import { ControlContext, type ControlLabelProps } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function ControlLabel(props:ControlLabelProps) {
  const { className, children, style, srOnly } = props;
  const { labelId=props.id, inputId=props.for, required } = useContext(ControlContext);

  return (
    <label
      className={cx(styles["control__label"], className, srOnly && "srOnly")}
      id={labelId}
      htmlFor={inputId}
      style={style}
    >
      {children}
      {required ? <span className={styles["control__asteriks"]}>*</span> : null}
    </label>
  )
}