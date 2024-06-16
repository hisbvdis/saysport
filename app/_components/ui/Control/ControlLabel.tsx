"use client";
import { useContext } from "react"
import { ControlContext } from "./Control"
import clsx from "clsx";
import styles from "./styles.module.css";


export default function ControlLabel(props:Props) {
  const controlContext = useContext(ControlContext);
  const labelId = props.id ?? controlContext?.labelId;
  const inputId = controlContext?.inputId;
  const required = controlContext?.required;
  const { className, children, style, srOnly } = props;

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

interface Props {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  srOnly?: boolean;
}