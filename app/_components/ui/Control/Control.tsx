"use client";
import cx from "classix";
import { createContext, useEffect, useId, useRef, useState } from "react"
// -----------------------------------------------------------------------------
import ControlLabel from "./ControlLabel";
import ControlSection from "./ControlSection";
import type { ControlContextType, ControlProps } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Control(props:ControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const inputId = useId();
  const { className, style, children } = props;
  const [ required, setRequired ] = useState(props.required ?? false);

  useEffect(() => {
    if (!required && containerRef.current?.querySelector("[required]")) {
      setRequired(true);
    }
  }, [])

  return (
    <ControlContext.Provider value={{ labelId, inputId, required }}>
      <div ref={containerRef} className={cx(styles["control"], className)} style={style}>
        {children}
      </div>
    </ControlContext.Provider>
  )
}

Control.Label = ControlLabel;
Control.Section = ControlSection;

export const ControlContext = createContext<ControlContextType>({} as ControlContextType);