import cx from "classix";
import type React from "react";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { FieldSetContext, type FieldSetLegendProps } from "./";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function FieldSetLegend(props:FieldSetLegendProps) {
  const { children, className, style, srOnly } = props;
  const { legendId } = useContext(FieldSetContext);

  return (
    <div
      id={legendId}
      className={cx(styles["fieldSet__legend"], className, srOnly && "srOnly")}
      style={style}
    >
      {children}
    </div>
  )
}