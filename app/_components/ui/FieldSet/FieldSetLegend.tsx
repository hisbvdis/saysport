import cx from "classix";
import type React from "react";
import { use } from "react";
// -----------------------------------------------------------------------------
import { FieldSetContext, type FieldSetLegendProps } from "./";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function FieldSetLegend(props:FieldSetLegendProps) {
  const { children, className, style, srOnly } = props;
  const { legendId } = use(FieldSetContext);

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