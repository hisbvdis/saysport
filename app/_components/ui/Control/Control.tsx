"use client";
import clsx from "clsx";
import { createContext, useEffect, useId, useRef, useState } from "react"
// -----------------------------------------------------------------------------
import ControlLabel from "./ControlLabel";
import ControlSection from "./ControlSection";
// -----------------------------------------------------------------------------


export default function Control(props:Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const inputId = useId();
  const { className, style, children } = props;
  const [ required, setRequired ] = useState(props.required ?? false)

  useEffect(() => {
    if (!required && containerRef.current?.querySelector("[required]")) {
      setRequired(true);
    }
  }, [required])

  return (
    <ControlContext.Provider value={{labelId, inputId, required}}>
      <div ref={containerRef} className={clsx("control", className)} style={style}>
        {children}
      </div>
    </ControlContext.Provider>
  )
}

Control.Label = ControlLabel;
Control.Section = ControlSection;

export const ControlContext = createContext<ControlContextType>({} as ControlContextType)

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  required?: boolean;
}

interface ControlContextType {
  labelId: string;
  inputId: string;
  required: boolean;
}