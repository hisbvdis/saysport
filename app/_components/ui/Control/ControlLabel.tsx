import clsx from "clsx";
import { useContext } from "react"
// -----------------------------------------------------------------------------
import { ControlContext, type ControlLabelProps } from ".";
// -----------------------------------------------------------------------------


export default function ControlLabel(props:ControlLabelProps) {
  const { className, children, style, srOnly } = props;
  const controlContext = useContext(ControlContext);
  const labelId = props.id ?? controlContext?.labelId;
  const inputId = props.for ?? controlContext?.inputId;
  const { required, styles } = controlContext;

  return (
    <label
      className={clsx(styles["control__label"], className, srOnly && "srOnly")}
      id={labelId}
      htmlFor={inputId}
      style={style}
    >
      {children}
      {required ? <span className={styles["control__asteriks"]}>*</span> : null}
    </label>
  )
}