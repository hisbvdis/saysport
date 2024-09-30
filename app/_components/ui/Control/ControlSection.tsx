import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { ControlContext, type ControlSectionProps } from "./";
// -----------------------------------------------------------------------------


export default function ControlSection(props:ControlSectionProps) {
  const { children, className, style } = props;
  const { styles } = useContext(ControlContext);

  return (
    <div className={clsx(styles["control__section"], className)} style={style}>
      {children}
    </div>
  )
}