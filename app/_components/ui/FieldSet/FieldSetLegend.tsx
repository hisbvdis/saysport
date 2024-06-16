import clsx from "clsx";
import React, { useContext } from "react";
// -----------------------------------------------------------------------------
import { FieldSetContext } from "./FieldSet";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function FieldSetLegend(props:Props) {
  const { children, className, style, srOnly } = props;
  const { legendId } = useContext(FieldSetContext);

  return (
    <legend
      id={legendId}
      className={clsx(styles["fieldSet__legend"], className, srOnly && "srOnly")}
      style={style}
    >
      {children}
    </legend>
  )
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  srOnly?: boolean;
}