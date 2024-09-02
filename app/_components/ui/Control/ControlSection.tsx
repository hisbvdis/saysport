"use client";

import clsx from "clsx";


export default function ControlSection(props:Props) {
  const { children, className, style } = props;

  return (
    <div className={clsx("control__section", className)} style={style}>
      {children}
    </div>
  )
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}