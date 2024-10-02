import clsx from "clsx";
import { use } from "react";
// -----------------------------------------------------------------------------
import { PopoverContext, type PopoverTriggerProps } from ".";
// -----------------------------------------------------------------------------


export default function PopoverTrigger(props:PopoverTriggerProps) {
  const { className, children, style } = props;
  const { openPopover, styles } = use(PopoverContext);

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