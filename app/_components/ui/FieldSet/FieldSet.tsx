"use client";
import clsx from "clsx";
import { createContext, useId } from "react"
// -----------------------------------------------------------------------------
import FieldSetLegend from "./FieldSetLegend";
import FieldSetSection from "./FieldSetSection";
import type { FieldSetContextType, FieldSetProps } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function FieldSet(props:FieldSetProps) {
  const { children, className, style } = props;
  const legendId = useId();

  return (
    <FieldSetContext.Provider value={{ legendId, styles }}>
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