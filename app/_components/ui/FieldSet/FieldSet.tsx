"use client";
import clsx from "clsx";
import { createContext, useId } from "react"
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";
import FieldSetLegend from "./FieldSetLegend";
import FieldSetSection from "./FieldSetSection";


export default function FieldSet(props:Props) {
  const { children, className, style } = props;
  const legendId = useId();

  return (
    <FieldSetContext.Provider value={{legendId}}>
      <fieldset
        className={clsx(styles["fieldSet"], className)}
        style={style}
        aria-labelledby={legendId}
      >
        { children }
      </fieldset>
    </FieldSetContext.Provider>
  )
}

export const FieldSetContext = createContext<FieldSetContextType>({} as FieldSetContextType);
FieldSet.Legend = FieldSetLegend;
FieldSet.Section = FieldSetSection;

interface Props {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface FieldSetContextType {
  legendId: string;
}