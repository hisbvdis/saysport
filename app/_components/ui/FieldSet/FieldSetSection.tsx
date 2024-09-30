import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { FieldSetContext, type FieldSetSectionProps } from ".";
// -----------------------------------------------------------------------------


export default function FieldSetSection(props:FieldSetSectionProps) {
  const { children, className, style } = props;
  const { styles } = useContext(FieldSetContext);

  return (
    <div className={clsx(styles["fieldset__section"], className)} style={style}>
      {children}
    </div>
  )
}