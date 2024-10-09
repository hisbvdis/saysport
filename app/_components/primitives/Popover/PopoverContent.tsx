import cx from "classix";
import { use } from "react"
// -----------------------------------------------------------------------------
import { type PopoverContentPropsType, PopoverContext } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function PopoverContent(props:PopoverContentPropsType) {
  const { children, style, className } = props;
  const { contentRef } = use(PopoverContext);

  return (
    <div className={cx(styles["popover__content"], className)} ref={contentRef} style={style}>
      {children}
    </div>
  )
}