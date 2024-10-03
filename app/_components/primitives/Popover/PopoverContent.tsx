import cx from "classix";
import { use } from "react";
// -----------------------------------------------------------------------------
import { PopoverContext, type PopoverContentPropsType } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function PopoverContent(props:PopoverContentPropsType) {
  const { children } = props;
  const { contentRef, isOpen, rootRef, isModal } = use(PopoverContext);

  return (
    <dialog className={cx(styles["popover"], isModal && styles["popover--modal"])} open={isOpen} ref={rootRef}>
      <div className={styles["popover__content"]} ref={contentRef}>
        {children}
      </div>
    </dialog>
  )
}