import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { type PopoverContentProps, PopoverContext } from ".";
// -----------------------------------------------------------------------------


export default function PopoverContent(props:PopoverContentProps) {
  const { className, children, style } = props;
  const { dialogContentRef, isModal, isOpen, dialogRef, styles } = useContext(PopoverContext);

  return (
    <dialog className={clsx(styles["popover"], isModal && styles["popover--modal"], className)} style={style} ref={dialogRef} open={isOpen}>
      <div className={clsx(styles["popover__content"], className)} style={style} ref={dialogContentRef}>
        {children}
      </div>
    </dialog>
  )
}