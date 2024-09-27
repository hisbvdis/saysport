import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { PopoverContext } from "./PopoverRoot";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function PopoverContent(props:Props) {
  const { className, children, style } = props;
  const { dialogContentRef } = useContext(PopoverContext);

  return (
    <div className={clsx(styles["popover__content"], className)} style={style} ref={dialogContentRef}>
      {children}
    </div>
  )
}

interface Props {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}