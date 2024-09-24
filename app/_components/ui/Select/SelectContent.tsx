import clsx from "clsx";
import type { SelectContentProps } from "./SelectTypes";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function SelectContent(props:SelectContentProps) {
  const { className, style, children } = props;

  return (
    <ul
      className={clsx(styles["select__content"], className)}
      style={style}
    >
      {children}
    </ul>
  )
}