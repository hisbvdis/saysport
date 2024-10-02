import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { PopoverContext, type PopoverTriggerProps } from ".";
// -----------------------------------------------------------------------------


export default function PopoverTrigger(props:PopoverTriggerProps) {
  const { className, children, style } = props;
  const { openPopover, styles } = useContext(PopoverContext);

  return (
    <button
      type="button"
      className={clsx(styles["popover__trigger"], className)}
      style={style}
      onClick={openPopover}
    >
      {children}
    </button>
  )
}