import cx from "classix";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { SelectContext } from "./";
// -----------------------------------------------------------------------------
import type { SelectArrowIconProps } from "./types";


export default function SelectArrowIcon(props:SelectArrowIconProps) {
  const { children, className, style } = props;
  const { isAutocomplete, styles } = useContext(SelectContext);

  if (isAutocomplete) return null;
  return (
    <span
      className={cx(styles["select__arrowIcon"], className)}
      style={style}
    >
      {children}
    </span>
  )
}