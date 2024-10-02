import clsx from "clsx";
// -----------------------------------------------------------------------------
import type { CardHeadingProps } from ".";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function CardHeading(props:CardHeadingProps) {
  const { className, children, style } = props;

  return (
    <div className={clsx(styles["card__heading"], className)} style={style}>
      {children}
    </div>
  )
}