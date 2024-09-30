import clsx from "clsx";
import type React from "react";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { FieldSetContext, type FieldSetLegendProps } from "./";
// -----------------------------------------------------------------------------


export default function FieldSetLegend(props:FieldSetLegendProps) {
  const { children, className, style, srOnly } = props;
  const { legendId, styles } = useContext(FieldSetContext);

  return (
    <div
      id={legendId}
      className={clsx(styles["fieldSet__legend"], className, srOnly && "srOnly")}
      style={style}
    >
      {children}
    </div>
  )
}